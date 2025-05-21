/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#033555",
        secondary: "#828282",
        thrid: "#70CEAF",
        fontColor: "#242526",
        placeholder: "#0000009C",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -2px rgba(3, 53, 85, 0.08)',
        button: '0 4px 6px -1px rgba(3, 53, 85, 0.1)'
      },
      spacing: {
        18: '4.5rem',
      }
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
};