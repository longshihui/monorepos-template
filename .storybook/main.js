module.exports = {
  stories: ["../packages/*/stories/*.stories.@(js|jsx|ts|tsx|mdx)"],
  logLevel: "error",
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/vue",
  features: {
    postcss: false,
  },
};
