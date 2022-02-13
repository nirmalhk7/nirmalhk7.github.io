module.exports = {
  content: [
    "src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    colors: {
      "white": "#ffffff",
      "accent": "#FF7B08",
      "gray": "#f1f1f1",
      "black": "#00000",
    },
    extend: {
      backgroundImage: {
        "beach": "url('/images/BeachNK_1.jpg')"
      },
      fontFamily:{
        "blocky": ["Montserrat"],
        'serif': ["georgia","Libre Baskerville","librebaskerville-bold","arial"],
        "sans-serif":["arial","Montserrat","montserrat-light","montserrat-regular","montserrat-bold","montserrat-semibold"],
        "monospace":["Consolas", "Andale Mono", "Courier", "Courier New","Menlo", "Bitstream Vera Sans Mono", "DejaVu Sans Mono", "Monaco"]
      },
      letterSpacing: {
        widest: "0.25rem"
      },
      height:{
        navbar: '72px'
      }
    },
  },
  plugins: [],
};
