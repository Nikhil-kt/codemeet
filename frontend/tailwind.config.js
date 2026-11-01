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
      fontFamily: {
        'vintage-heading': ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        'vintage-body': ['"Lora"', '"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Redaction 10"', '"Noto Serif Khitan Small Script"', 'serif'],
        serif: ['"Redaction 10"', '"Noto Serif Khitan Small Script"', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -4px rgba(249, 115, 22, 0.08), 0 2px 6px -2px rgba(120, 113, 108, 0.04)',
        'card-hover': '0 20px 40px -12px rgba(249, 115, 22, 0.18), 0 8px 18px -6px rgba(249, 115, 22, 0.08)',
      },
      colors: {
        parchment: {
          DEFAULT: '#F3E3C3',
          light: '#FFF8EB',
          card: 'rgba(255, 250, 238, 0.82)',
          dark: '#EBD6B0',
        },
        ink: {
          DEFAULT: '#4A2410',
          body: '#5C4033',
          muted: '#7C5A48',
        },
        sepia: {
          DEFAULT: 'rgba(139, 94, 52, 0.28)',
          dark: '#8B5E34',
          badge: 'rgba(245, 230, 206, 0.75)',
        },
        'burnt-orange': {
          DEFAULT: '#E8590C',
          dark: '#B8430A',
          light: '#FF6B1A',
        },
        'vintage-olive': '#5B7A2F',
        theme: {
          bg: '#FFF3E8',
          surface: '#FFFFFF',
          'surface-sub': '#FFEDD5',
          'text-primary': '#7C2D12',
          'text-body': '#431407',
          'text-secondary': '#9A3412',
          'text-muted': '#78716C',
          primary: '#F97316',
          'primary-hover': '#EA580C',
          border: '#FED7AA',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
    },
  },
  plugins: [],
};
