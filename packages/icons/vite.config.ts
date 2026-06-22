import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ThunderstoreIcons",
      fileName: (format) =>
        `thunderstore-icons.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    emptyOutDir: false,
    rollupOptions: {
      // Never bundle FontAwesome icon data. Externalizing by pattern also means
      // the build does not require the (optional) Pro packages to be installed —
      // in placeholder mode the generated entry only imports the free packages.
      external: [/^@fortawesome\//],
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
});
