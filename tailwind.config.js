/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'clouds': 'clouds 20s linear infinite',
        'sun': 'sunshine 8s ease-in-out infinite',
        'rain': 'rain 0.5s linear infinite',
        'snow': 'snowfall 10s linear infinite',
      },
      keyframes: {
        clouds: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        sunshine: {
          '0%, 100%': { transform: 'scale(1.02)' },
          '50%': { transform: 'scale(1.05)' },
        },
        rain: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        snowfall: {
          '0%': { backgroundPosition: '0 -100%' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
    },
  },
  plugins: [],
}

