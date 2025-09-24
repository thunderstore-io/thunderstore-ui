import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["build/**/*"],
    setupFiles: ["@vitest/web-worker"],
  },
});
