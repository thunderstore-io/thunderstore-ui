import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    // Because of a WSL2 limitations we must use polling and set the interval to a 500
    // This way we don't kill the cpu
    // https://vitejs.dev/config/server-options.html#server-watch
    watch: { usePolling: true, interval: 500 },
    hmr: { path: "/react-router" },
    allowedHosts: [".thunderstore.dev", ".thunderstore.io"],
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  build: {
    // For building the assets under right path.
    // TODO: Remove when moving fully under TS main domain.
    assetsDir: "__remix",
  },
});
