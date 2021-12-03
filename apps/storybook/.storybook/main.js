module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    {
      directory: "../stories/components",
      files: "*.stories.*",
      titlePrefix: "@thunderstore/components",
    },
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@snek-at/storybook-addon-chakra-ui", // Must come after @storybook addons
  ],
  framework: "@storybook/react",
};
