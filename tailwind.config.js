export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#001B50",
        secondary: "#004094",
        suport: {
          100: "#151C2A",
          200: "#00142E",
          300: "#0A0A0A",
          400: "#000714",
        },
        subtitle: "#3E6292",
      },
      screens: {
        mobile: "980px",
        tablet: "1130px",
        laptop: "1351px",
        fullhd: "1897px",
      },
      fontFamily: {
        jockey: ['"Jockey One"', "sans‑serif"],
        kaisei: ['"Kaisei Tokumin"', "sans‑serif"],
        exo2: ['"Exo 2"', "sans‑serif"],
      },
    },
  },
  plugins: [],
};
