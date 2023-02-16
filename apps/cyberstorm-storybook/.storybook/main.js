module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    {
      directory: "../stories/components",
      files: "*.stories.*",
      titlePrefix: "@thunderstore/cyberstorm",
    },
    {
      directory: "../stories/layouts",
      files: "*.stories.*",
      titlePrefix: "@thunderstore/cyberstorm",
    },
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "storybook-css-modules",
      options: {
        cssModulesLoaderOptions: {
          importLoaders: 1,
          modules: {
            localIdentName: "[name]__[local]--[hash:base64:5]",
          },
        },
      },
    },
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
};
