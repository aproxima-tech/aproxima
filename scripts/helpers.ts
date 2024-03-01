import fs from "fs";
import path from "path";

export function getWorkspaceDirs() {
    // Adjust the base directory to point to the root of the project, assuming the script is run from the root
    const baseDir = path.join(__dirname, "..");
    
    // Define specific directories relative to the project root
    const specificDirs = ['auth', 'home', 'shop', 'core-api'].map(dir => path.join(baseDir, dir));
    // Define the path to the packages directory relative to the project root
    const packagesDir = path.join(baseDir, 'packages');
    
    // Dynamically list subdirectories within the packages directory
    const packageSubDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(packagesDir, dirent.name));
    
    return [...specificDirs, ...packageSubDirs];
}