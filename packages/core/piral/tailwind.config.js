/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/shell/**/*.{html,js,tsx}"],
  safelist: [
    {
      pattern: /./,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
