module.exports = {
  plugins: {
    tailwindcss: {
      theme: {
        inset: {
          "1/2": "50%",
          "0": 0,
          auto: "auto",
        },
        extend: {
          spacing: {
            "36": "9rem",
            "72": "18rem",
            "84": "21rem",
            "96": "24rem",
          },
        },
      },
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production"
      ? {
          "@fullhuman/postcss-purgecss": {
            content: [
              "./pages/**/*.{js,jsx,ts,tsx}",
              "./components/**/*.{js,jsx,ts,tsx}",
            ],
            whitelistPatternsChildren: [/monaco-editor/], // so it handles .monaco-editor .foo .bar
            defaultExtractor: (content) =>
              content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        }
      : {}),
  },
};
