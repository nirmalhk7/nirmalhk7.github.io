module.exports = {
  content: [
    "src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    screens: {
      "xs": "0px",
      "sm": "576px",
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
    fontSize: {
      'mini': ['1.2rem', {
        lineHeight: '3rem',
        letterSpacing: '0.1em'
      }],
      'base': ['1.6rem', {
        lineHeight: '3rem',
      }],
      'h1': ['3.6rem', {
        lineHeight: '4.5rem',
        letterSpacing: '-.1rem'
      }],
      'h2': ['3rem', {
        lineHeight: '3.9rem',
      }],
      'h3': ['2.4rem', {
        lineHeight: '3rem',
      }],
      'h4': ['2.1rem', {
        lineHeight: '2.7rem',
      }],
      'h5': ['1.6rem', {
        lineHeight: '2.1rem',
      }],
      'h6': ['1.4rem', {
        lineHeight: '2.4rem',
        letterSpacing: '.16rem'
      }]
    },
    extend: {
      backgroundImage: {
        "beach": "url('/images/BeachNK_1.jpg')"
      },
      fontFamily: {
        "blocky": ["Montserrat", "sans-serif"],
        "heading": ["Libre Baskerville", "serif"],
      },
      letterSpacing: {
        widest: "0.25rem",
        blocky: "0.15rem"
      },
      height: {
        navbar: '72px'
      },

      // lineHeight: {
      //   '3xl': '3.375'
      // }
    },
  },
  plugins: [],
};
