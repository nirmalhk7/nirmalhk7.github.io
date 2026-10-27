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
      // Preserve the portfolio's scoped runtime tokens in reusable utilities.
      fontSize: {
        'body-px': '16px',
        'label-px': '12px',
      },
      maxWidth: { content: '1360px' },
      brightness: {
        25: '.25'
      },
      colors: {
        portfolio: {
          paper: 'var(--portfolio-paper)',
          ink: 'var(--portfolio-ink)',
          night: 'var(--portfolio-night)',
          red: 'var(--portfolio-red)',
          'red-hover': 'var(--portfolio-red-hover)',
          muted: 'var(--portfolio-muted)',
          surface: 'var(--portfolio-muted-surface)',
        },
        accent: "#D93838",
        accentLight: "#D9A9A9",
      },
      boxShadow: {
        workexp: "0 0 0 9px #e9e9e9",
      },
      backgroundImage: {
        beachNirmal: "url('../images/BeachNK_1.jpg')",
        blogWallpaper: "url('../images/pitlane.jpg')",
        nasaEarth: "url('../images/nasa-earth.jpg')",
      },
      fontFamily: {
        body: ['var(--portfolio-body)'],
        display: ['var(--portfolio-display)'],
        'portfolio-sans': ['var(--portfolio-sans)'],
        'portfolio-mono': ['var(--portfolio-mono)'],
        blocky: ["Portfolio Outfit", "Avenir Next", "sans-serif"],
        heading: ["Portfolio Outfit", "Avenir Next", "sans-serif"],
        mono: ["Portfolio Plex Mono", "ui-monospace", "monospace"],
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
