import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
    exclude: ["dist/**/*"],
    // environmentOptions: {
    //   jsdom: {
    //     resources: "usable",
    //   },
    // },
    // deps: {
    //   inline: [/@thunderstore\/ts-uploader/],
    // },
    setupFiles: ["@vitest/web-worker"],
  },
});
