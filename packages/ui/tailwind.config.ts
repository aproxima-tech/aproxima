import type { Config } from 'tailwindcss';
import path from 'path';
import tailwindAnimate from 'tailwindcss-animate';

/// Node resolve path to: @aproxima/ui/src/**/*.{js,jsx,ts,tsx}
const uiLibClasses = path.resolve(__dirname, 'src/**/*.{js,jsx,ts,tsx}');

export default {
  // Content lookup in Remix app/ folder and in ui lib src folder
  content: ['./app/**/*.{js,jsx,ts,tsx}', uiLibClasses],
  theme: {
    extend: {
      boxShadow: {
        'interactive-light': '-9px 9px 18px #9d9d9d, 9px -9px 18px #ffffff',
        'interactive-dark': '-9px 9px 18px #0e0e0e, 9px -9px 18px #363636',
      },
      colors: {
        white: '#fafaf9',
        'primary-light-purple': '#A97BB5',
        'primary-dark-purple': '#817BB5',
        'secondary-light-purple': '#f4ebff',
        'secondary-dark-purple': '#5D5B7F',
        'tertiary-light-gray': '#fbfbfb',
        'tertiary-dark-gray': '#222222',
        'text-dark-gray': '#222222',
        'text-white': '#F5F5F5',
        'text-light-purple': '#e9d6ff',
        'text-dark-purple': '#5d5b7f',
        'background-light-gray': '#D9D9D9',
        'background-lighter-gray': '#f5f5f4',
        'background-lighter-dark-gray': '#44403c',
        'background-dark-gray': '#222222',
        'background-light-purple': '#f4ebff',
        'background-dark-purple': '#69567f',
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
