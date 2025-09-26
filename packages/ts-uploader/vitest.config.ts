import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    exclude: ["dist/**/*"],
    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium", headless: true }],
    },
  },
  optimizeDeps: {
    include: ["crypto-js"],
  },
});
