/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // Vibrant Forest Green
          light: '#10B981',
          dark: '#047857',
        },
        secondary: {
          DEFAULT: '#7C3AED', // Rich Purple
          light: '#8B5CF6',
          dark: '#6D28D9',
        },
        accent: {
          DEFAULT: '#F59E0B', // Warm Amber
          light: '#FBBF24',
          dark: '#D97706',
        },
        background: {
          light: '#ECFDF5', // Soft Mint
          dark: '#1E293B',
        },
        text: {
          light: '#F0FDF4',
          dark: '#1F2937',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        yusei: ['"Yusei Magic"', 'Arial'],  
        comfortaa: ['"Comfortaa"', 'Arial'],
      },
      letterSpacing: {
        extra: '0.08em',  // Custom letter spacing
        wider: '0.15em',
      },
    },
  },
  plugins: [],
}
