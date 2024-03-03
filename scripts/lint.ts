import { $ } from "bun";
import path from "path";
import { getWorkspaceDirs } from "./helpers";

/**
 * Lint the workspaces
 */
async function exec() {
  const baseDir = path.join(__dirname, "..");
  for (const dir of getWorkspaceDirs(baseDir)) {
    console.log(`Linting ${dir}...`);
    await $`cd ${dir} && bun run lint && bun run typecheck`;
  }
}

exec()
  .then(() => console.log("Linting completed."))
  .catch((error) => console.error('Linting failed:', error));
