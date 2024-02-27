# Aproxima ESLint Config

This package provides a default ESLint configuration for [ESLint v8.5 flat configurations](https://eslint.org/docs/latest/use/configure/configuration-files-new).

## Installation

### Using npm

```bash
npm install --save-dev typescript prettier eslint @aproxima/eslint-config
```

### Using yarn

```bash
yarn add --dev typescript prettier eslint @aproxima/eslint-config
```

### Using bun

```bash
bun install --save-dev typescript prettier eslint @aproxima/eslint-config
```

## Setup

### JavaScript/TypeScript

Create an `eslint.config.js` file in the root of your project and add the following:

```javascript
import aproximaEslintConfig from "@aproxima/eslint-config";

export default aproximaEslintConfig;
```

### Remix

Create an `eslint.config.js` file in the root of your project and add the following:

```javascript
import aproximaEslintConfig from "@aproxima/eslint-config/remix";

export default aproximaEslintConfig;
```

## VSCode

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add the following to your workspace `settings.json`:

```json
{
  "editor.formatOnSave": true,
  "[javascript][javascriptreact][typescript][typescriptreact]": {
    // Turn formatOnSave off for JS and JSX, controlled by ESLint
    "editor.formatOnSave": false
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  // flat config is still experimental
  "eslint.experimental.useFlatConfig": true
}
```

If you are working in a monorepo, you may need to also add the `eslint.workingDirectories` setting to your workspace `settings.json` for each app/package directory:

```json
{
  "eslint.workingDirectories": ["./packages/*"]
}
```
