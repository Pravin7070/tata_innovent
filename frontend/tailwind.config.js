/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        automotive: {
          black: '#000000',
          dark: '#1A1A1A',
          blue: '#00B4D8', // Electric Blue
          green: '#39FF14', // Neon Green
          white: '#FFFFFF',
          gray: '#8E8E93',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
