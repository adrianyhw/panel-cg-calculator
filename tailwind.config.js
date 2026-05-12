/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        concrete: {
          50: '#f8f7f6',
          100: '#eeecea',
          200: '#d9d6d2',
          300: '#bfbab4',
          400: '#a09892',
          500: '#857d76',
          600: '#6e6761',
          700: '#5a5350',
          800: '#4c4643',
          900: '#413d3b',
        },
      },
    },
  },
  plugins: [],
}
