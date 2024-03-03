import { $ } from "bun";
import fs from "fs";
import path from "path";
import { getWorkspaceDirs } from "./helpers";

/**
 * Clean the workspaces
 */
async function exec() {
  // Adjust the base directory to point to the root of the project, assuming the script is run from the root
  const baseDir = path.join(__dirname, "..");
  for (const dir of getWorkspaceDirs(baseDir)) {
    console.log(`Cleaning ${dir}...`);
    // Check if wrangler.toml exists and if it includes the line: database_name = "core-db"
    const wranglerToml = await $`cat ${dir}/wrangler.toml`.text();
    if (wranglerToml.includes('database_name = "core-db"')) {
      console.log("Detected core-db D1 in wrangler.toml.");

      // Delete existing .wrangler directory
      const wranglerPath = path.join(dir, ".wrangler");
        if (fs.existsSync(wranglerPath)) {
            console.log(`Deleting ${wranglerPath}...`);
            fs.rmSync(wranglerPath, { recursive: true });
        }

      // For each file in /core-db/migrations, starting by 0000_*, and going through all ordered sql migration files,
      // run the command: wrangler d1 execute core-db --local --file=./migrations/[migration_file_name].sql
      const migrationDir = path.join(baseDir, "core-db/migrations");
      console.log(`Running migrations in ${migrationDir}...`);
      const files = fs.readdirSync(migrationDir).filter((file) => file.endsWith(".sql"));
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
