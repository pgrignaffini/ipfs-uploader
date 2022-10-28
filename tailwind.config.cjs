/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    }
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#9ef285",
          "secondary": "#abfcdc",
          "accent": "#47c918",
          "neutral": "#251727",
          "base-100": "#253C55",
          "base-200": "#1E2F43",
          "info": "#56B3C8",
          "success": "#3AD992",
          "warning": "#EFA51A",
          "error": "#E76965",
        },
      },
    ],
  },
};
