import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryVitePlugin } from "@sentry/vite-plugin";

installGlobals();

export default defineConfig({
  server: {
    // Because of a WSL2 limitations we must use polling and set the interval to a 500
    // This way we don't kill the cpu
    // https://vitejs.dev/config/server-options.html#server-watch
    watch: { usePolling: true, interval: 500 },
    hmr: { path: "/remixhmr" },
  },
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/healthz", "healthz.tsx", {
            id: "healthz",
          });
          route("/communities", "communities/communities.tsx", {
            index: true,
            id: "landing-page",
          });
          route("/c/:communityId", "c/community.tsx");
          route(
            "/c/:communityId/p/:namespaceId/:packageId",
            "p/packageListing.tsx",
            () => {
              route("", "p/tabs/Readme/Readme.tsx", { index: true });
              route("required", "p/tabs/Required/Required.tsx");
              route("changelog", "p/tabs/Changelog/Changelog.tsx");
              route("versions", "p/tabs/Versions/Versions.tsx");
            }
          );
          route(
            "/package/create/docs",
            "tools/package-format-docs/packageFormatDocs.tsx"
          );
          route(
            "/tools/markdown-preview",
            "tools/markdown-preview/markdownPreview.tsx"
          );
          route(
            "/tools/manifest-v1-validator",
            "tools/manifest-validator/manifestValidator.tsx"
          );
          if (process.env.ENABLE_BROKEN_PAGES) {
            route(
              "/c/:communityId/p/:namespaceId/:packageId/dependants",
              "p/dependants/Dependants.tsx"
            );
            route("/teams", "settings/teams/Teams.tsx");
            route(
              "/teams/:namespaceId",
              "settings/teams/team/teamSettings.tsx",
              () => {
                route("", "settings/teams/team/tabs/Profile/Profile.tsx", {
                  index: true,
                });
                route(
                  "members",
                  "settings/teams/team/tabs/Members/Members.tsx"
                );
                route(
                  "service-accounts",
                  "settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx"
                );
                route(
                  "settings",
                  "settings/teams/team/tabs/Settings/Settings.tsx"
                );
              }
            );
            route("/settings", "settings/user/Settings.tsx", () => {
              route("", "settings/user/Connections/Connections.tsx", {
                index: true,
              });
              route("account", "settings/user/Account/Account.tsx");
            });
          }
        });
      },
    }),
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
