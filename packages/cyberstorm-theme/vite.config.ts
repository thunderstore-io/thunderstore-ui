import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ThunderstoreCyberstormTheme",
      fileName: (format) =>
        `thunderstore-cyberstorm-theme.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
  },
});
