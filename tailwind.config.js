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
        logo: ["Inter", "sans-serif"],
        title: ["Inter", "sans-serif"],
        menu: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Logo
        logo: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // 40px
        // Heading
        "heading-1": ["2rem", { lineHeight: "2.5rem" }], // 32px
        "heading-2": ["1.5rem", { lineHeight: "2rem" }], // 24px
        "heading-3": ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        // Menu
        menu: ["1rem", { lineHeight: "1.5rem" }], // 16px
        // Body text
        body: ["0.95rem", { lineHeight: "1.6" }], // ~15px
        small: ["0.875rem", { lineHeight: "1.4" }], // 14px
        // Sử dụng cũ
        "text-primary": "20px",
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      boxShadow: {
        custom: "0px 0px 15px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["hover"],
    },
  },
  plugins: [],
};
