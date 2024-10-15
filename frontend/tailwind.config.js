/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("flowbite/plugin")],

  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "clr-accent": "#ff7a29",
        "clr-primary": "#106bf3",
        "clr-heading": "#000a18",
        "clr-text": "#111827",
        "clr-accent-grad-start": "#15bff7",
        "clr-accent-grad-end": "#1068f3",
        "clr-white-grad-start": "#baeeff",
        "clr-white-grad-end": "#e0ecff",
      },
    },
  },
  plugins: [],
};
