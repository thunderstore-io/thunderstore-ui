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
    "@chakra-ui/storybook-addon",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
};
