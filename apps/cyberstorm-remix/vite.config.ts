import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter } from "@sentry/react-router";
import { type ProxyOptions, defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Paths the Thunderstore backend owns. In the default setup nginx routes these
// to Django and everything else to this dev server; with DEV_API_PROXY_TARGET
// set, this dev server does that routing itself (see buildBackendProxy).
//
// Deliberately not `/favicon.ico` or `/robots.txt`: nginx sends those to Django,
// but this app serves its own, so proxying them would shadow the real ones.
const BACKEND_PATH_PREFIXES = [
  "/api",
  "/auth",
  "/logout",
  "/djangoadmin",
  "/healthcheck",
  "/media",
  "/static",
  "/thumbnail-serve",
];

// Legacy per-community API consumed by the mod managers, e.g.
// /c/<community>/api/v1/package-listing-index/. A RegExp (Vite treats keys
// starting with `^` as one) so the /c/ PAGE routes still reach the app.
const LEGACY_COMMUNITY_API_PATTERN = "^/c/[^/]+/api/";

/**
 * Routes the backend-owned paths to `target` so cyberstorm-remix can be
 * developed without running the Thunderstore backend locally.
 *
 * This is the same split nginx performs in the docker setup, moved into the dev
 * server: point VITE_API_URL at the dev server itself and both SSR and the
 * browser reach the upstream API through here, exactly as they both reach it
 * through nginx today. Same-origin matters — the upstream sends no CORS headers,
 * so a browser calling it directly from localhost would be blocked.
 */
function buildBackendProxy(target: string) {
  const options: ProxyOptions = {
    target,
    changeOrigin: true,
    // Upstream cookies are scoped to its own domain and marked Secure; neither
    // survives on http://localhost, so a session set through the proxy would be
    // silently dropped. Rewrite the domain off and relax the flags.
    cookieDomainRewrite: "",
    configure: (proxy) => {
      proxy.on("proxyRes", (proxyRes) => {
        const cookies = proxyRes.headers["set-cookie"];
        if (!Array.isArray(cookies)) return;
        proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
          cookie
            .replace(/;\s*Secure/gi, "")
            .replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
        );
      });
    },
  };

  return Object.fromEntries(
    [...BACKEND_PATH_PREFIXES, LEGACY_COMMUNITY_API_PATTERN].map((path) => [
      path,
      options,
    ])
  );
}

export default defineConfig((config) => {
  const { mode } = config;
  const env = loadEnv(mode, process.cwd(), "");

  // Extra allowed hosts (comma separated) so the dev server accepts requests
  // proxied by nginx, e.g. ".thunderstore.localhost".
  const additionalAllowedHosts = (
    env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS ?? ""
  )
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  // Opt-in: unset (the default) leaves the dev server exactly as it was, with
  // nginx and a local backend doing the routing.
  const backendProxyTarget = env.DEV_API_PROXY_TARGET?.trim();

  return {
    server: {
      // Bind to all interfaces so the nginx container can reach the dev server
      // on the host via host.docker.internal:3000. Note this also exposes the
      // dev server (with source maps + HMR) to the local network — fine on a
      // trusted machine; avoid running it on untrusted/public Wi-Fi.
      host: true,
      port: 3000,
      strictPort: true,
      // Native file watching is fast on Windows/macOS/Linux. Polling is only
      // needed inside WSL2 or a bind-mounted container; opt in with
      // VITE_USE_POLLING=true there instead of paying its cost everywhere.
      watch:
        env.VITE_USE_POLLING === "true"
          ? { usePolling: true, interval: 500 }
          : undefined,
      hmr: { path: "/react-router" },
      allowedHosts: [
        ".thunderstore.dev",
        ".thunderstore.io",
        ".thunderstore.localhost",
        ...additionalAllowedHosts,
      ],
      proxy: backendProxyTarget
        ? buildBackendProxy(backendProxyTarget)
        : undefined,
    },
    plugins: [
      reactRouter(),
      tsconfigPaths(),
      env.SENTRY_ORG && env.SENTRY_PROJECT
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
      // Hashed assets use Vite's default "assets" dir so the production server
      // (@react-router/serve) applies its built-in immutable, 1-year cache to
      // them — it only long-caches the "/assets" path. (Previously "__remix",
      // which missed that rule and left hashed assets at Cache-Control:
      // max-age=0.)
      cssCodeSplit: false,
    },
  };
});
