import fs from "node:fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function copyFonts() {
  return {
    name: "copy-fonts",
    closeBundle() {
      try {
        const dist = resolve(__dirname, "dist");
        if (!fs.existsSync(dist)) {
          fs.mkdirSync(dist, { recursive: true });
        }

        const fontsCss = resolve(__dirname, "src/styles/fonts.css");
        if (fs.existsSync(fontsCss)) {
          fs.copyFileSync(fontsCss, resolve(dist, "fonts.css"));
        } else {
          console.warn(
            `[copy-fonts] Build succeeded, but ${fontsCss} was missing.`
          );
        }

        const fontsDir = resolve(__dirname, "src/styles/fonts");
        if (fs.existsSync(fontsDir)) {
          fs.cpSync(fontsDir, resolve(dist, "fonts"), {
            recursive: true,
          });
        } else {
          console.warn(
            `[copy-fonts] Build succeeded, but ${fontsDir} was missing.`
          );
        }
      } catch (error) {
        console.warn("[copy-fonts] Failed to copy font assets:", error);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: "./tsconfig.json",
    }),
    copyFonts(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ThunderstoreCyberstormTheme",
      fileName: (format) =>
        `thunderstore-cyberstorm-theme.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name === "style.css" ||
            assetInfo.name === "cyberstorm-theme.css"
          ) {
            return "cyberstorm-theme[extname]";
          }
          return "[name]-[hash][extname]";
        },
      },
    },
    emptyOutDir: false,
  },
});
