# Setup your dev environment

## Install the required programs

You have to install the following programs in order to execute the scripts and applications in this repository. Make sure to install the correct version of each program to avoid any issues.

- [Bun](https://bun.sh/) >=1.0.29

> :warning: The dev environment has not been tested on Windows. Use a Unix-based system to avoid any issues.

### Bun

Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager. Bun is used as the script runner and package manager in this monorepo.

## Install dependencies across the monorepo

To install the dependencies for all the packages in the monorepo, run the following command from the root:

```sh
bun run init
```
