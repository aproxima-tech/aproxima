import { $ } from "bun";
import path from "path";
import { getAppDirs } from "./helpers";

/**
 * Deploy all apps
 */
async function exec() {
  // Adjust the base directory to point to the root of the project, assuming the script is run from the root
  const baseDir = path.join(__dirname, "..");

  // For each workspace, delete temporary folders
  for (const dir of getAppDirs(baseDir)) {
    // Read package.json
    const packageJson = require(path.join(dir, "package.json"));
    // Check if it contains a "deploy" script
    if (packageJson.scripts?.deploy) {
      console.log(`Deploying ${dir}...`);
      await $`cd ${dir} && bun run deploy`;
    }
  }
}

exec()
  .then(() => console.log("Deploy completed."))
  .catch((error) => console.error("Deploy failed:", error));
