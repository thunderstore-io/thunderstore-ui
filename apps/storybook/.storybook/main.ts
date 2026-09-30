import type { StorybookConfig } from "@storybook/react-vite";
import module from "node:module";
import path from "node:path";

import { prefixCyberstormThemePostcss } from "./prefixCyberstormThemeCss.ts";

const require = module.createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return path.dirname(require.resolve(path.join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(viteConfig) {
    // Composition stories import component modules directly so TurboSnap
    // does not follow the package barrel.
    // import.meta.dirname, not fileURLToPath: `pnpm run build` is a browser
    // bundle of this file (index.html points at it), and a named import from
    // node:url fails that bundle. Storybook itself still runs this in Node.
    const csSrc = path.resolve(
      import.meta.dirname,
      "../../../packages/cyberstorm/src"
    );
    const existingAlias = viteConfig.resolve?.alias;
    const alias = Array.isArray(existingAlias)
      ? [...existingAlias, { find: "@cs", replacement: csSrc }]
      : { ...existingAlias, "@cs": csSrc };
    viteConfig.resolve = { ...viteConfig.resolve, alias };

    const existingPostcss = viteConfig.css?.postcss;
    const existingPlugins =
      existingPostcss &&
      typeof existingPostcss === "object" &&
      "plugins" in existingPostcss &&
      Array.isArray(existingPostcss.plugins)
        ? existingPostcss.plugins
        : [];

    viteConfig.css = {
      ...viteConfig.css,
      postcss: {
        ...(typeof existingPostcss === "object" && existingPostcss
          ? existingPostcss
          : {}),
        // Prefixes cyberstorm-theme and cyberstorm.theme-reset onto [data-cs-theme="on"].
        plugins: [...existingPlugins, prefixCyberstormThemePostcss()],
      },
    };
    return viteConfig;
  },
};
export default config;
