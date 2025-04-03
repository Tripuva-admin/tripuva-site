/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // Forest Green
          light: '#10B981',
          dark: '#047857',
        },
        secondary: {
          DEFAULT: '#6B7280', // Muted Gray
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        accent: {
          DEFAULT: '#F59E0B', // Warm Amber
          light: '#FBBF24',
          dark: '#D97706',
        },
        background: {
          light: '#FFFFFF', // Pure White
          dark: '#F3F4F6', // Light Gray
        },
        text: {
          light: '#F9FAFB',
          dark: '#1F2937',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        yusei: ['"Yusei Magic"', 'Arial'],  
        comfortaa: ['"Comfortaa"', 'Arial'],
        timeburner: ['"Timeburner"', 'Arial'],
      },
      letterSpacing: {
        extra: '0.08em',  // Custom letter spacing
        wider: '0.15em',
      },
    },
  },
  plugins: [],
}
