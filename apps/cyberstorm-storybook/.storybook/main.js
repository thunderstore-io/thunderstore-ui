import path from "path";

export default {
  core: {
    enableCrashReports: false,
  },
  stories: [
    "../stories/**/*.mdx",
    {
      directory: "../stories/components",
      files: "*.@(mdx|stories.*)",
      titlePrefix: "@thunderstore/cyberstorm",
    },
    {
      directory: "../stories/layouts",
      files: "*.@(mdx|stories.*)",
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
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: true,
  },
  babel: (config) => ({
    ...config,
    configFile: path.resolve(__dirname, "../../../babel.config.js"),
  }),
  typescript: {
    check: true,
  },
};
