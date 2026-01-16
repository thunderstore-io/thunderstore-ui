import { defineProject } from "vitest/config";

const cyberstormRoot = new URL("./cyberstorm", import.meta.url).pathname;

export default defineProject({
  resolve: {
    alias: {
      cyberstorm: cyberstormRoot,
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
});
