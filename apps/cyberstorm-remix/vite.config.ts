import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
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
              route("changelog", "p/tabs/Changelog/Changelog.tsx");
              route("versions", "p/tabs/Versions/Versions.tsx");
            }
          );
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
              route("members", "settings/teams/team/tabs/Members/Members.tsx");
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
        });
      },
    }),
    tsconfigPaths(),
    cjsInterop({
      // REMIX TODO: Figure out if some of the radix packages can be updated
      // so that we don't need to do this.
      // List of CJS dependencies that require interop
      dependencies: [
        "@radix-ui/react-checkbox",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        // "@radix-ui/react-radio-group",
        // "@radix-ui/react-select",
        // "@radix-ui/react-switch",
        // "@radix-ui/react-toast",
        "@radix-ui/react-tooltip",
        // "@thunderstore/cyberstorm/**",
        // "some-package",
        // // Deep imports should be specified separately
        // "some-package/deep/import",
        // // But globs are supported
        // "some-package/foo/*",
        // // Even deep globs for scoped packages
        // "@some-scope/**",
      ],
    }),
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
