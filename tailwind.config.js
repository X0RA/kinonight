const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // This enables the 'class' strategy for dark mode
  theme: {
    colors: {
      primary: colors.indigo,
      secondary: colors.yellow,
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      slate: colors.slate,
      red: colors.red,
    },
    extend: {
      colors: {
        "custom-light": {
          background: "#f8f9fa",
          text: "#212529",
          // ... other light mode specific colors
        },
        "custom-dark": {
          background: "#212529",
          text: "#f8f9fa",
          // ... other dark mode specific colors
        },
        "custom-warm": {
          background: "#ffede1", // example warm color
          text: "#5a2d0c",
          // ... other warm mode specific colors
        },
        "custom-cool": {
          background: "#e0f4f1", // example cool color
          text: "#1c606a",
          // ... other cool mode specific colors
        },
        // ... add as many custom color sets as you need
      },
    },
  },
  plugins: [],
};
