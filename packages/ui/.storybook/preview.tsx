import type { Preview } from '@storybook/react';
import '../src/styles/tailwind.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'lightGray',
          value: '#D9D9D9',
        },
        {
          name: 'darkGray',
          value: '#222222',
        },
        {
          name: 'lighterGray',
          value: '#f5f5f4',
        },
        {
          name: 'lighterDarkGray',
          value: '#44403c',
        },
      ],
    },
  },
};

export default preview;
