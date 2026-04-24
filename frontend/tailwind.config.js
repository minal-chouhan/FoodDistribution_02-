/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["'Syne'", "sans-serif"],
        dm:   ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink:    "#1A1612",
        cream:  "#F7F4EE",
        forest: "#1D7A45",
        "forest-light": "#E6F5ED",
      }
    }
  },
  plugins: []
}
