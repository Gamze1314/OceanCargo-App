/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "5px": "5px",
      },
      fontFamily: {
        sans: ["Times New Roman", "serif"],
      },
      colors: {
        navy: "#001f3f",
      },
    },
  },
  plugins: [],
};

