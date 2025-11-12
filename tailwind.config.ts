import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#eaf0ff',
          200: '#cfdcff',
          300: '#a5bdff',
          400: '#7895ff',
          500: '#516dff',
          600: '#3a4ef0',
          700: '#2d3ecc',
          800: '#2736a8',
          900: '#232f88'
        }
      }
    }
  },
  plugins: []
} satisfies Config
