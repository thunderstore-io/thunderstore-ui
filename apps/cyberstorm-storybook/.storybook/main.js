module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    {
      directory: "../stories/components",
      files: "*.stories.*",
      titlePrefix: "@thunderstore/cyberstorm",
    },
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
};
