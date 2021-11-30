module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@snek-at/storybook-addon-chakra-ui",  // Must come after @storybook addons
  ],
  "framework": "@storybook/react",
};
