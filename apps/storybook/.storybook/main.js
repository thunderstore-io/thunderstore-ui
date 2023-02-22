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
      titlePrefix: "@thunderstore/components",
    },
  ],
  addons: [
    "@chakra-ui/storybook-addon",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  features: {
    emotionAlias: false, // Required for chakra storybook addon
  },
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
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
};
