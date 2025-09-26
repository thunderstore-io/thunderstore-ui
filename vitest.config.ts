import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["packages/**", "apps/**"],
      exclude: [
        "**/node_modules",
        "**/build",
        "**/dist",
        "**/types",
        // Remix specific folder to ignore
        "**/+types",
        // Storybook specific folders to ignore
        "**/storybook-static",
        "**/*.cjs.js",
        "**/*.mjs.ts",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/*.config.js",
        "**/*.config.cjs",
      ],
      reporter: ["text", "json"],
    },
    projects: ["apps/**/*/vitest.config.ts", "packages/*/vitest.config.ts"],
  },
});
