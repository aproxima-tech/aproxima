import fs from "fs";
import path from "path";

export function getWorkspaceDirs(baseDir: string) {
    // Define specific directories relative to the project root
    const specificDirs = getAppDirs(baseDir);
    // Define the path to the packages directory relative to the project root
    const packagesDir = path.join(baseDir, 'packages');
    
    // Dynamically list subdirectories within the packages directory
    const packageSubDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(packagesDir, dirent.name));
    
    return [...specificDirs, ...packageSubDirs];
}

export function getAppDirs(baseDir: string) {
  // Define specific directories relative to the project root
  return ['auth', 'home', 'shop', 'core-api'].map(dir => path.join(baseDir, dir));
}