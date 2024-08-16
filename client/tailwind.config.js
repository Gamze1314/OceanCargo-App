/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "5px": "5px",
      },
      colors: {
        navy: "#001f3f",
      },
    },
  },
  plugins: [],
};

