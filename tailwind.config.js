/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        primary: {
          DEFAULT: '#1E40AF', // Deep Blue
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#059669', // Emerald Green
          light: '#10B981',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#D97706', // Amber
          light: '#F59E0B',
          dark: '#B45309',
        },
        background: {
          light: '#F8FAFC',
          dark: '#1E293B',
        },
        text: {
          light: '#F1F5F9',
          dark: '#0F172A',
          muted: '#64748B',
        },
      },
      fontFamily: {
        'timeburner': ['Timeburner', 'sans-serif'],
        'comfortaa': ['Comfortaa', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'urbanist': ['Urbanist', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'yusei': ['Yusei Magic', 'sans-serif'],
      },
      letterSpacing: {
        'extra': '0.02em',
        'wider': '0.05em',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      fontSize: {
        '4.5xl': '2.5rem', // adjust as needed (2.5rem = 40px, between 4xl and 5xl)
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
    
  },
  plugins: [],
}
