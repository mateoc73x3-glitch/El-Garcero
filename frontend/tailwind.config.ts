import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#084838',
        secondary: '#E68A00',
        accent: '#F5D765',
        cream: '#F4EFE2',
        background: '#FAF8F3',
      },
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 48px -24px rgba(8, 72, 56, 0.18)',
        orange: '0 20px 40px -16px rgba(230, 138, 0, 0.45)',
      },
      borderRadius: {
        premium: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
