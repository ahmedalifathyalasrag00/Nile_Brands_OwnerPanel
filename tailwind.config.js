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
    },
  },
  plugins: [require("flowbite/plugin")],
};
