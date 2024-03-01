import { $ } from "bun";
import { getWorkspaceDirs } from "./helpers";

/**
 * Lint the workspaces
 */
async function lintWorkspaces() {
  for (const dir of getWorkspaceDirs()) {
    console.log(`Linting ${dir}...`);
    await $`cd ${dir} && bun run lint`;
  }
}

lintWorkspaces()
  .then(() => console.log("Linting completed."))
  .catch((error) => console.error('Linting failed:', error));
