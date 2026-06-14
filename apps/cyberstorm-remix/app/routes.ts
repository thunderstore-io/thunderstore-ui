import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("./communities/communities.tsx", { id: "rootIndex" }),
  route("healthz", "./healthz.tsx"),
  route("robots.txt", "./robotsTxt.tsx"),
  route("sitemap.xml", "./sitemap.tsx"),

  route("/communities", "./communities/communities.tsx"),
  route("/c/:communityId", "c/Community.tsx", [
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
        route("source", "p/tabs/Source/Source.tsx"),
        ...prefix("wiki", [
          layout("p/tabs/Wiki/Wiki.tsx", { id: "wikiLayout" }, [
            index("p/tabs/Wiki/WikiFirstPage.tsx"),
            route("/new", "p/tabs/Wiki/WikiNewPage.tsx"),
            route("/:slug", "p/tabs/Wiki/WikiPage.tsx"),
            route("/:slug/edit", "p/tabs/Wiki/WikiPageEdit.tsx"),
          ]),
        ]),
      ]),
      route(
        ":namespaceId/:packageId/v/:packageVersion",
        "p/packageListingVersion.tsx",
        [
          route(
            "/c/:communityId/p/:namespaceId/:packageId/v/:packageVersion/",
            "p/tabs/Readme/PackageVersionReadme.tsx"
          ),
          route("required", "p/tabs/Required/Required.tsx", {
            id: "VersionRequired",
          }),
          route("versions", "p/tabs/Versions/PackageVersionVersions.tsx"),
        ]
      ),
    ]),
  ]),
  /**
   * Disabled until we figure out how to ensure the community-agnostic
   * endpoints won't serve rejected packages (rejections are listing-,
   * and thus community-specific).

  route(
    "/p/:namespaceId/:packageId/v/:packageVersion",
    "p/packageVersionWithoutCommunity.tsx",
    [
      route(
        "/p/:namespaceId/:packageId/v/:packageVersion/",
        "p/tabs/Readme/PackageVersionWithoutCommunityReadme.tsx"
      ),
      route("required", "p/tabs/Required/Required.tsx", {
        id: "WithoutCommunityRequired",
      }),
      route(
        "versions",
        "p/tabs/Versions/PackageVersionWithoutCommunityVersions.tsx"
      ),
    ]
  ),
  */
  route(
    "/c/:communityId/p/:namespaceId/:packageId/dependants",
    "p/dependants/Dependants.tsx"
  ),
  route("/c/:communityId/p/:namespaceId", "p/team/Team.tsx"),
  route(
    "/tools/markdown-preview",
    "tools/markdown-preview/markdownPreview.tsx"
  ),
  route(
    "/tools/manifest-v1-validator",
    "tools/manifest-validator/manifestValidator.tsx"
  ),
  route("/package/create", "upload/upload.tsx"),
  // Legacy base-domain package URLs: the old Django CommunitySite served
  // `/package/...` as the riskofrain2 community. Redirect them to the
  // community-scoped `/c/riskofrain2/...` routes. `/package/create` above wins
  // by route ranking (static > splat); the splat only catches the rest.
  route("/package/*", "legacyPackageRedirect.tsx"),

  route("/login", "login/login.tsx"),

  route("/settings", "settings/user/Settings.tsx", [
    route("", "settings/user/Connections/Connections.tsx", {
      index: true,
    }),
    route("account", "settings/user/Account/Account.tsx"),
  ]),
  route("/teams", "settings/teams/Teams.tsx"),
  route("/teams/:namespaceId", "settings/teams/team/teamSettings.tsx", [
    route("", "settings/teams/team/tabs/Profile/Profile.tsx", {
      index: true,
    }),
    route("members", "settings/teams/team/tabs/Members/Members.tsx"),
    route(
      "service-accounts",
      "settings/teams/team/tabs/ServiceAccounts/ServiceAccounts.tsx"
    ),
    route("settings", "settings/teams/team/tabs/Settings/Settings.tsx"),
  ]),
] satisfies RouteConfig;
