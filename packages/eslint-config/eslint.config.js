import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default typescriptEslint.config({
  files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  ignores: ['node_modules', 'dist', 'build', 'coverage', 'public', '.wrangler', '.cache'],
  extends: [
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    eslintPluginPrettierRecommended, // Keep this last so it can disable rules that conflict with Prettier, also includes eslint-config-prettier
  ],
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
