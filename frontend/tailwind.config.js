/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#026597',
          700: '#034a70',
          900: '#072d46',
        },
        slate: {
          850: '#141d2b',
          950: '#0a0f17'
        }
      }
    },
  },
  plugins: [],
}
