import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxAlly from 'eslint-plugin-jsx-a11y';

export default typescriptEslint.config({
  files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  extends: [
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    eslintPluginPrettierRecommended, // Keep this last so it can disable rules that conflict with Prettier, also includes eslint-config-prettier
  ],
  plugins: {
    react,
    reactHooks,
    jsxAlly,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    formComponents: ['Form'],
    linkComponents: [
      { name: 'Link', linkAttribute: 'to' },
      { name: 'NavLink', linkAttribute: 'to' },
    ],
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    // TODO: Enable these rules once ESLint flat config is supported
    // "simple-import-sort/imports": "error",
    // "simple-import-sort/exports": "error",
    // "import/first": "error",
    // "import/newline-after-import": "error",
    // "import/no-duplicates": "error",
  },
});
