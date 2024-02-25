# Setup your dev environment

## Install the required programs

You have to install the following programs in order to execute the scripts and applications in this repository. Make sure to install the correct version of each program to avoid any issues.

- [Bun](https://bun.sh/) >=1.0.29
- [Terraform](https://www.terraform.io/) >=v1.5
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/) >=3.29.0

> :warning: The dev environment has not been tested on Windows. Use a Unix-based system to avoid any issues.

### Bun

Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager. Bun is used as the script runner and package manager in this monorepo.

### Terraform (optional)

Terraform is an infrastructure as code tool that enables you to safely and predictably provision and manage infrastructure in any cloud. Terraform is used to manage the infrastructure required to run the applications in this monorepo. It is not required for development but is recommended if you want to test infrastructure plans locally.

### Wrangler (optional)

Wrangler, the Cloudflare Developer Platform command-line interface (CLI), allows you to manage Worker projects. Wrangler is used to deploy the Cloudflare Workers in this monorepo. Wrangler is a development dependency for each worker script, but also offers some useful orchestration commands for the monorepo. To run general wrangler commands, you can install it globally:

```sh
bun add -g wrangler
wranger login
wranger d1 list
```

## Install dependencies across the monorepo

To install the dependencies for all the packages in the monorepo, run the following command from the root:

```sh
bun run init
```
