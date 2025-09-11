import {
  type RouteConfig,
  index,
  route,
  // index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  // index("./communities/communities.tsx"),
  route("healthz", "./healthz.tsx"),

  route("/communities", "./communities/communities.tsx"),
  route("/c/:communityId", "c/community.tsx", [
    route("/c/:communityId/", "c/tabs/PackageSearch/PackageSearch.tsx"),
    ...prefix("p", [
      route(":namespaceId/:packageId", "p/packageListing.tsx", [
        route(
          "/c/:communityId/p/:namespaceId/:packageId/",
          "p/tabs/Readme/Readme.tsx"
        ),
        route("required", "p/tabs/Required/Required.tsx"),
        route("changelog", "p/tabs/Changelog/Changelog.tsx"),
        route("versions", "p/tabs/Versions/Versions.tsx"),
        ...prefix("wiki", [
          layout("p/tabs/Wiki/Wiki.tsx", [
            index("p/tabs/Wiki/WikiFirstPage.tsx"),
            route("/new", "p/tabs/Wiki/WikiNewPage.tsx"),
            route("/:slug", "p/tabs/Wiki/WikiPage.tsx"),
            route("/:slug/edit", "p/tabs/Wiki/WikiPageEdit.tsx"),
          ]),
        ]),
      ]),
      route(":namespaceId/:packageId/edit", "p/packageEdit.tsx"),
    ]),
  ]),
  route(
    "/c/:communityId/p/:namespaceId/:packageId/dependants",
    "p/dependants/Dependants.tsx"
  ),
  route("/c/:communityId/p/:namespaceId", "p/team/Team.tsx"),
  route(
    "/package/create/docs",
    "tools/package-format-docs/packageFormatDocs.tsx"
  ),
  route(
    "/tools/markdown-preview",
    "tools/markdown-preview/markdownPreview.tsx"
  ),
  route(
    "/tools/manifest-v1-validator",
    "tools/manifest-validator/manifestValidator.tsx"
  ),
  route("/package/create", "upload/upload.tsx"),

  // TODO: DISABLED UNTIL WE'VE GOT THE ENDPOINTS FOR THESE
  // route("/settings", "settings/user/Settings.tsx", [
  //   route("", "settings/user/Connections/Connections.tsx", {
  //     index: true,
  //   }),
  //   route("account", "settings/user/Account/Account.tsx"),
  // ]),
  // route("/teams", "settings/teams/Teams.tsx"),
  // route("/teams/:namespaceId", "settings/teams/team/teamSettings.tsx", [
  //   route("", "settings/teams/team/tabs/Profile/Profile.tsx", {
  //     index: true,
  //   }),
  //   route("members", "settings/teams/team/tabs/Members/Members.tsx"),
  //   route(
  //     "service-accounts",
  //     "settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx"
  //   ),
  //   route("settings", "settings/teams/team/tabs/Settings/Settings.tsx"),
  // ]),

  // layout("./auth/layout.tsx", [
  //   route("login", "./auth/login.tsx"),
  //   route("register", "./auth/register.tsx"),
  // ]),

  // ...prefix("concerts", [
  //   index("./concerts/home.tsx"),
  //   route(":city", "./concerts/city.tsx"),
  //   route("trending", "./concerts/trending.tsx"),
  // ]),
] satisfies RouteConfig;
