import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

const { dependencies, peerDependencies } = pkg as unknown;

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ThunderstoreCyberstorm",
      fileName: (format) =>
        `thunderstore-cyberstorm.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies || {}),
        ...Object.keys(dependencies || {}),
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled",
        },
      },
    },
  },
});
