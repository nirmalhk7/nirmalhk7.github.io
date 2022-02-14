module.exports = {
  content: [
    "src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    screens: {
      "xs":"0px",
      "sm":"576px",
      "md": "768px",
      "lg": "992px",
      "xl": "1200px",
      "xxl": "1400px"
    },
    colors: {
      "white": "#ffffff",
      "accent": "#FF7B08",
      "accentLight": "#ffb652",
      "gray": "#f1f1f1",
      "black": "#000000",
    },

    extend: {
      backgroundImage: {
        "beach": "url('/images/BeachNK_1.jpg')"
      },
      fontFamily: {
        "blocky": ["Montserrat","sans-serif"],
        "heading": ["Libre Baskerville","serif"],
     },
      letterSpacing: {
        widest: "0.25rem",
        blocky: "0.15rem"
      },
      height: {
        navbar: '72px'
      }
    },
  },
  plugins: [],
};
