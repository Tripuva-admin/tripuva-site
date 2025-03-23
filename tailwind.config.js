/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2472',
          50: '#E6EAF4',
          100: '#CCD4E9',
          200: '#99A9D3',
          300: '#667EBD',
          400: '#3353A7',
          500: '#0A2472',
          600: '#081D5B',
          700: '#061644',
          800: '#040F2D',
          900: '#020816',
        },
      },
      fontFamily: {
        julee: ['Julee', 'cursive'], 
      },
      letterSpacing: {
        extra: '0.06em',  // Custom letter spacing
        wider: '0.15em',
      },
    },
  },
  plugins: [],
};
