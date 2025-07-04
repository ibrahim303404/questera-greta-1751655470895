/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        secondary: '#141414',
        dark: '#000000',
        light: '#FFFFFF',
        gray: {
          850: '#1a1a1a',
          900: '#0a0a0a',
        }
      },
      height: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}