import aproximaEslintConfig from '@aproxima/eslint-config/remix';
import { config } from 'typescript-eslint';

export default config(
  {
    ignores: ['storybook-static'],
  },
  ...aproximaEslintConfig,
);
