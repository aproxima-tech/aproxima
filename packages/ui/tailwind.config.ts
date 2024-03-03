import type { Config } from 'tailwindcss';
import path from 'path';

/// Node resolve path to: @aproxima/ui/src/**/*.{js,jsx,ts,tsx}
const uiLibClasses = path.resolve(__dirname, 'src/**/*.{js,jsx,ts,tsx}');

export default {
  // Content lookup in Remix app/ folder and in ui lib src folder
  content: ['./app/**/*.{js,jsx,ts,tsx}', uiLibClasses],
  theme: {
    extend: {
      colors: {
        primary: '#A97BB5',
        primaryAccent: '#9F7BB5',
        secondary: '#817BB5',
        secondaryAccent: '#8B7BB5',
        text: '#222222',
        textDark: '#F5F5F5',
        backgroundPrimary: '#f5f5f4',
        backgroundDarkPrimary: '#44403c',
        background: '#fafaf9',
        backgroundDark: '#222222',
      },
    },
  },
  plugins: [],
} satisfies Config;
