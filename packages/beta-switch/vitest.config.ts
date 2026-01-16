import { defineProject } from "vitest/config";

const packageRoot = new URL("./", import.meta.url).pathname;

export default defineProject({
  root: packageRoot,
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    exclude: ["dist/**/*"],
    environment: "node",
    browser: {
      enabled: false,
    },
  },
});
