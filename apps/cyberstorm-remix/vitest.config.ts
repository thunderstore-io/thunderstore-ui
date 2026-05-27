import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineProject } from "vitest/config";

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const cyberstormRoot = path.join(projectDir, "cyberstorm");
// package.json exports point at dist/, which CI does not build before `yarn coverage`.
const cyberstormPackageSrc = path.resolve(
  projectDir,
  "../../packages/cyberstorm/src/index.ts"
);

export default defineProject({
  resolve: {
    alias: {
      cyberstorm: cyberstormRoot,
      "@thunderstore/cyberstorm": cyberstormPackageSrc,
    },
  },
  test: {
    include: ["**/__tests__/**/*.test.ts"],
    exclude: ["dist/**/*"],
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
    ],
  },
});
