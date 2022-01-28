module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "entry",
      },
    ],
    "@vue/babel-preset-jsx",
  ],
  plugins: ["@babel/plugin-syntax-jsx"],
};
