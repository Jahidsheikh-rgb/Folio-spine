/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f3',
          100: '#faefe2',
          200: '#f4dcc3',
          300: '#ecc198',
          400: '#e29e68',
          500: '#d97f43',
          600: '#cb6533',
          700: '#a84e2b',
          800: '#874029',
          900: '#6e3624',
          950: '#3b1a11',
        },
        ink: {
          900: '#14171f',
          800: '#1e232e',
          700: '#2d3444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(20, 23, 31, 0.06)',
        card: '0 10px 30px -5px rgba(20, 23, 31, 0.08)',
      },
    },
  },
  plugins: [],
};
