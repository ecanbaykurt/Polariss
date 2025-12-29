/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nasa-red': '#E31937',
        'nasa-blue': '#0B3D91',
        'space-dark': '#0a0e27',
        'space-purple': '#6B46C1',
        'space-orange': '#F97316',
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'nasa-gradient': 'linear-gradient(135deg, #0B3D91 0%, #E31937 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}


