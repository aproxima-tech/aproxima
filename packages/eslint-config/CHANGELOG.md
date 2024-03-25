### 0.0.4

Added `no-else-return` rule, which disallows `else` blocks following `if` blocks that contain a `return` statement.

### 0.0.2

Created [Remix](https://remix.run) specific configuration and added it to the package. Can be used by adding `@remix-run/eslint-config/remix` instead of `@remix-run/eslint-config` to the `extends` array in your `eslint.config.js` file.

### 0.0.0

Followed the [Publishing a Sharable Config](https://eslint.org/docs/latest/extend/shareable-configs#publishing-a-shareable-config) guide to create the initial version of the package.
