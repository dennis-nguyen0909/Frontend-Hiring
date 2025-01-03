/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#0f65cc",
        textBlack: "#18191C",
        btnColor: "#EDEFF5",
        primaryColorH: "#d3464f",
        primaryColor: "#d64453",
        grayPrimary: "#80878e",
      },
      spacing: {
        primary: "110px",
        primaryx2: "220px",
        primaryx3: "330px",
        primaryx4: "440px",
      },
      textColor: {
        primary: "#0f65cc",
        title: "#5E6670",
        grayText: "#767F8C",
        graySecondary: "#8f8f8f",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        custom: "0px 0px 15px rgba(0, 0, 0, 0.15)",
      },
      fontSize: {
        "text-primary": "20px",
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["hover"], // Enable border color change on hover
    },
  },
  plugins: [],
};
