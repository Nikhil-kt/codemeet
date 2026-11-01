/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        cosmic: {
          950: '#09090b',
          900: '#121110',
          850: '#181614',
          800: '#211e1b',
          700: '#332e29',
          border: 'rgba(245, 158, 11, 0.15)',
          glow: '#f59e0b',
        },
        impact: {
          amber: '#f59e0b',
          orange: '#f97316',
          gold: '#fbbf24',
          charcoal: '#0c0a09',
        }
      },
    },
  },
  plugins: [],
};
