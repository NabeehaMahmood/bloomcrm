import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nature & Plant themed colors
        'bloom': {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Soft green
          300: '#86efac',  // Medium green
          400: '#4ade80',  // Vibrant green
          500: '#22c55e',  // Primary green
          600: '#16a34a',  // Dark green
          700: '#15803d',  // Deeper green
          800: '#166534',  // Very dark green
          900: '#145231',  // Almost black-green
        },
        'leaf': {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bfef45',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
        },
        'petal': {
          pink: '#fca5a5',      // Rose
          purple: '#d8b4fe',    // Lavender
          orange: '#fed7aa',    // Poppy
          yellow: '#fef08a',    // Sunflower
        },
        'earth': {
          50: '#faf5f0',
          100: '#f5ede4',
          200: '#e8d9cc',
          300: '#d9c9b8',
          400: '#b89968',
          500: '#a0826d',
          600: '#6b5344',
          700: '#3f2817',
          800: '#2a1810',
        },
      },
      backgroundImage: {
        'gradient-bloom': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-nature': 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
      },
      boxShadow: {
        'bloom': '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
