let plugin= require('tailwindcss/plugin');

module.exports = {
  content: [
    "src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    screens: {
      "xs": {'min':"0px"},
      "sm": {'min':"576px"},
      "md": {'min':"768px"},
      "lg": {'min':"992px"},
      "xl": {'min':"1200px"},
      "xxl": {'min':"1400px"}
    },
    colors: {
      "white": "#ffffff",
      "accent": "#FF7B08",
      "accentLight": "#ffb652",
      "gray": "#f1f1f1",
      "darkgray": "#7d7d7d",
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
      }],
      "lead": ["2rem",{
        lineHeight: "3.6rem"
      }],
      "button": ["1.2rem",{
        lineHeight: "4.8rem",
        letterSpacing: '.3rem'

      }],
      'navbar': ['1.0rem', {
        letterSpacing: '.25rem',
        lineHeight: '7.2rem',
      }]
    },
    extend: {

      boxShadow: {
        'workexp': '0 0 0 9px #e9e9e9',
      },
      backgroundImage: {
        "beac": "url('/images/BeachNK_1.jpg')"
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
