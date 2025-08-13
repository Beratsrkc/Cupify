/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orangeBrand: "#ff7f00",      // ana renk
        orangeBrandDark: "#e67000",  // hover için koyu ton
      },
    },
  },
  plugins: [],
}