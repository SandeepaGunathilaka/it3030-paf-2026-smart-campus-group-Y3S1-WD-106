/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'DM Sans'", 'system-ui', 'sans-serif'],
      },
      colors: {
        campus: {
          50:  '#F0F3FA',
          100: '#D5DEEF',
          200: '#B1C9EF',
          300: '#8AAEE0',
          400: '#638ECB',
          500: '#4A6FA5',
          600: '#395886',
          700: '#2D4A73',
          800: '#223860',
          900: '#1A2D4D',
        },
      },
    },
  },
  plugins: [],
}
