import { $ } from "bun";
import fs from "fs";
import path from "path";
import { getWorkspaceDirs } from "./helpers";

const foldersToClear = [
  "node_modules",
  "build",
  ".cache",
  ".wrangler",
  "public/build",
];

/**
 * Clean the workspaces
 */
async function exec() {
  // Adjust the base directory to point to the root of the project, assuming the script is run from the root
  const baseDir = path.join(__dirname, "..");

  // For each workspace, delete temporary folders
  for (const dir of getWorkspaceDirs(baseDir)) {
    console.log(`Cleaning ${dir}...`);

    for (const folder of foldersToClear) {
      const folderPath = path.join(dir, folder);
      if (fs.existsSync(folderPath)) {
        console.log(`Deleting ${folderPath}...`);
        fs.rmSync(folderPath, {
          recursive: true,
        });
      }
    }
  }

  // Running bun install from root
  console.log("Running bun install from root...");
  await $`cd ${baseDir} && bun install`;

  // For each workspace with d1 dependency, run the migrations
  for (const dir of getWorkspaceDirs(baseDir)) {
    console.log(`Checking ${dir} for d1 dependency...`);
    // Check if wrangler.toml exists and if it includes the line: database_name = "core-db"
    const wranglerToml = await $`cat ${dir}/wrangler.toml`.text();
    if (wranglerToml.includes('database_name = "core-db"')) {
      console.log("Detected core-db D1 in wrangler.toml.");

      // For each file in /core-db/migrations, starting by 0000_*, and going through all ordered sql migration files,
      // run the command: wrangler d1 execute core-db --local --file=./migrations/[migration_file_name].sql
      const migrationDir = path.join(baseDir, "core-db/migrations");
      console.log(`Running migrations in ${migrationDir}...`);
      const files = fs
        .readdirSync(migrationDir)
        .filter((file) => file.endsWith(".sql"));
      for (const file of files) {
        console.log(`Running migration ${file} in ${dir}...`);
        await $`cd ${dir} && wrangler d1 execute core-db --local --file=${path.join(migrationDir, file)}`;
      }
    }
  }
}

exec()
  .then(() => console.log("Cleaning completed."))
  .catch((error) => console.error("Cleaning failed:", error));
