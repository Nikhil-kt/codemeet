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
        heading: ['"Plus Jakarta Sans"', '"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', '"Lora"', 'serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'ngo-card': '0 1px 2px rgba(122, 46, 14, 0.06), 0 8px 24px rgba(255, 107, 26, 0.10)',
        'ngo-card-hover': '0 24px 48px rgba(255, 107, 26, 0.25)',
        'ngo-glow': '0 0 32px rgba(255, 107, 26, 0.35)',
      },
      colors: {
        brand: {
          50: '#FFF4E8',
          100: '#FFE3CC',
          200: '#FED7AA',
          300: '#FFA96B',
          400: '#FF9A4D',
          500: '#FF6B1A',
          600: '#E8590C',
          700: '#B8430A',
          800: '#7A2E0E',
          900: '#431407',
        },
        ngo: {
          primary: '#FF6B1A',
          deep: '#E8590C',
          cream: '#FFF4E8',
          peach: '#FFE3CC',
          heading: '#7A2E0E',
          body: '#6B5B53',
          card: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
