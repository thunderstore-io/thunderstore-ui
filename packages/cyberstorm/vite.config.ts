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
        `thunderstore-cyberstorm.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
      cssFileName: "thunderstore-cyberstorm",
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
          "@fortawesome/fontawesome-svg-core": "fontawesomeSvgCore",
          "@fortawesome/free-solid-svg-icons": "freeSolidSvgIcons",
          "@fortawesome/react-fontawesome": "reactFontawesome",
          "@fortawesome/pro-solid-svg-icons": "proSolidSvgIcons",
          "@radix-ui/react-tooltip": "reactTooltip",
          "@radix-ui/react-dropdown-menu": "reactDropdownMenu",
          "@radix-ui/react-dialog": "Dialog",
          "@radix-ui/react-select": "reactSelect",
          "@radix-ui/react-switch": "RadixSwitch",
          "@radix-ui/react-toast": "RadixToast",
          uuid: "uuid",
          "s-ago": "ago",
          "react-syntax-highlighter": "reactSyntaxHighlighter",
          "react/jsx-runtime": "jsxRuntime",
          // Explicitly define globals for Thunderstore packages to avoid Rollup warnings
          "@thunderstore/graph-system": "graphSystem",
          "@thunderstore/thunderstore-api": "thunderstoreApi",
          "@thunderstore/typed-event-emitter": "typedEventEmitter",
        },
      },
    },
  },
});
