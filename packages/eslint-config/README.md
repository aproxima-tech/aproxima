# Aproxima ESLint Config

This package provides a default ESLint configuration for ESLint v8.5 flat configuration.

## Installation

### Using npm

```bash
npm install --save-dev @aproxima/eslint-config
```

### Using bun (like in this monorepo)

```bash
bun install --save-dev @aproxima/eslint-config
```

## Setup

Create an `eslint.config.js` file in the root of your project and add the following:

```javascript
import aproximaEslintConfig from "@aproxima/eslint-config";

export default aproximaEslintConfig;
```

