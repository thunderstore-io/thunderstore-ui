import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter } from "@sentry/react-router";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  const { mode } = config;
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
      env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT
        ? sentryReactRouter(
            {
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
            },
            config
          )
        : null,
    ],
    build: {
      // For building the assets under right path.
      // TODO: Remove when moving fully under TS main domain.
      assetsDir: "__remix",
      cssCodeSplit: false,
    },
  };
});
