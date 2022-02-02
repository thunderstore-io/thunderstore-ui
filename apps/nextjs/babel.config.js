module.exports = {
  presets: [
    "next/babel",
    [
      "@babel/preset-env",
      {
        modules: "cjs",
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
