import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [tsconfigPaths()],
  test: {
    include: ["**/__tests__/**/*.test.ts"],
    exclude: ["**/node_modules/**", "dist/**/*"],
    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium", headless: true }],
    },
  },
  optimizeDeps: {
    include: [
      "lodash/isEqual",
      "semver/functions/valid",
      "react/jsx-dev-runtime",
      "react",
      "react-router",
      "react-dom",
      "react-dom/client",
      "react-dom/server",
      // react-markdown must be pre-bundled in the same pass as react, or it
      // gets its own optimized copy, hooks resolve against a second React
      // instance and every render throws "Cannot read properties of null".
      "react-markdown",
      "rehype-raw",
      "remark-gfm",
    ],
  },
});
