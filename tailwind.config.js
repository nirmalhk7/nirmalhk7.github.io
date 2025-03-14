/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{js,tsx,ts,jsx}"],
  theme: {
    screens: {
      "mobile-l": { min: "576px" },
      tablet: { min: "768px" },
      laptop: { min: "1024px" },
      "laptop-l": { min: "1440px" },
    },
    extend: {
      brightness: {
        25: '.25'
      },
      fontSize: {
        h1: [
          "3.6rem",
          {
            // lineHeight: '3.25rem',
            // letterSpacing: '-.1rem',
            // fontWeight: '700'
          },
        ],
        h2: [
          "3rem",
          {
            // lineHeight: '3.3rem',
          },
        ],
        h3: [
          "2.4rem",
          {
            // lineHeight: '3.25rem',
          },
        ],
        h4: [
          "2.1rem",
          {
            // lineHeight: '3.286rem',
          },
        ],
        h5: [
          "1.6rem",
          {
            // lineHeight: '3.3125rem',
          },
        ],
        h6: [
          "1.4rem",
          {
            // lineHeight: '3.5rem',
            // letterSpacing: '.16rem',
            // fontWeight: '700'
          },
        ],
        lead: [
          "2rem",
          {
            // lineHeight: "3.6rem"
          },
        ],
        button: [
          "1.2rem",
          {
            lineHeight: "4.8rem",
            letterSpacing: ".3rem",
          },
        ],
        navbar: [
          "1.0rem",
          {
            letterSpacing: ".25rem",
            lineHeight: "7.2rem",
          },
        ],
      },
      colors: {
        accent: "#D93838",
        accentLight: "#ffb652",
      },
      boxShadow: {
        workexp: "0 0 0 9px #e9e9e9",
      },
      backgroundImage: {
        beachNirmal: "url('../images/BeachNK_1.jpg')",
        milkyWay: "url('../images/MilkyWay.jpg')",
        blogWallpaper: "url('../images/pitlane.jpg')",
        nasaEarth: "url('../images/nasa-earth.jpg')",
        f1Car: "url('../images/f1car.jpg')",
      },
      fontFamily: {
        blocky: ["Montserrat", "sans-serif"],
        heading: ["Libre Baskerville", "serif"],
      },
      letterSpacing: {
        widest: "0.25rem",
        blocky: "0.15rem",
      },
      height: {
        navbar: "72px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
      },
      lineHeight: {
        "": "",
      },
    },
  },
  plugins: [],
};
