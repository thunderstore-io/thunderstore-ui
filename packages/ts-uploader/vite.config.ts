import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ts-uploader",
      fileName: (format) =>
        `thunderstore-ts-uploader.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [
        "@thunderstore/graph-system",
        "@thunderstore/thunderstore-api",
        "@thunderstore/typed-event-emitter",
      ],
      output: {
        globals: {
          "@thunderstore/graph-system": "graphSystem",
          "@thunderstore/thunderstore-api": "thunderstoreApi",
          "@thunderstore/typed-event-emitter": "typedEventEmitter",
        },
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
