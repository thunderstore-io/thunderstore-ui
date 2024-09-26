import path, { dirname, join } from "path";

export default {
  core: {
    enableCrashReports: false,
  },
  stories: [
    "../stories/**/*.mdx",
    {
      directory: "../stories/components",
      files: "*.@(mdx|stories.*)",
      titlePrefix: "@thunderstore",
    },
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
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
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  staticDirs: ["../public"],
  docs: {},
  babel: (config) => ({
    ...config,
    configFile: path.resolve(__dirname, "../../../babel.config.js"),
  }),
  typescript: {
    check: true,
    reactDocgen: "react-docgen-typescript",
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
