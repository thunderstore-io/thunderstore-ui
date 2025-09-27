import {
  LinkingProvider,
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  AdContainer,
} from "@thunderstore/cyberstorm";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import {
  useLoaderData,
  useLocation,
  useMatches,
  Meta,
  Links,
  ScrollRestoration,
  Scripts,
} from "react-router";
import { Footer } from "~/commonComponents/Footer/Footer";
import { NavigationWrapper } from "~/commonComponents/Navigation/NavigationWrapper";
import { RootLoadersType } from "~/root";
import { BetaButtonInit } from "./betaButton";
import { getCommunityBreadcrumb } from "./breadcrumbs/getCommunityBreadcrumb";
import { getPackageListingBreadcrumb } from "./breadcrumbs/getPackageListingBreadcrumb";
import { adContainerIds, AdsInit } from "./nitroAds";
import { TooltipProvider } from "./tooltipProvider";
import Toast from "@thunderstore/cyberstorm/src/newComponents/Toast";

/** Layout component to provide common UI around all pages */
export function RootLayout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<RootLoadersType>();
  let envVars = undefined;
  let shouldUpdatePublicEnvVars = false;
  if (import.meta.env.SSR) {
    envVars = getPublicEnvVariables([
      "VITE_SITE_URL",
      "VITE_BETA_SITE_URL",
      "VITE_API_URL",
      "VITE_COOKIE_DOMAIN",
      "VITE_AUTH_BASE_URL",
      "VITE_AUTH_RETURN_URL",
      "VITE_CLIENT_SENTRY_DSN",
    ]);
    shouldUpdatePublicEnvVars = true;
  } else {
    envVars = window.NIMBUS_PUBLIC_ENV;
    if (
      data &&
      data.publicEnvVariables &&
      data.publicEnvVariables !== envVars
    ) {
      shouldUpdatePublicEnvVars = true;
    }
  }

  const resolvedEnvVars = data ? data.publicEnvVariables : envVars;

  const location = useLocation();
  // const splitPath = location.pathname.split("/");
  // const isSubPath = splitPath.length > 4;
  // const enableCommunitiesBreadCrumb =
  //   location.pathname === "/communities" || location.pathname.startsWith("/c/");
  // const isPackageListingSubPath =
  //   splitPath.length > 5 && splitPath[1] === "c" && splitPath[3] === "p";
  const matches = useMatches();

  const userSettingsPage = matches.find(
    (m) => m.id === "settings/user/Settings"
  );
  const userSettingsAccountPage = matches.find(
    (m) => m.id === "settings/user/Account/Account"
  );
  const teamsPage = matches.find((m) => m.id === "settings/teams/Teams");
  const teamSettingsPage = matches.find(
    (m) => m.id === "settings/teams/team/teamSettings"
  );
  const teamSettingsProfilePage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Profile/Profile"
  );
  const teamSettingsMembersPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Members/Members"
  );
  const teamSettingsServiceAccountsPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/ServiceAccounts/ServiceAccounts"
  );
  const teamSettingsSettingsPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Settings/Settings"
  );
  const communitiesPage = matches.find(
    (m) => m.id === "communities/communities"
  );
  const uploadPage = matches.find((m) => m.id === "upload/upload");
  const communityPage = matches.find((m) => m.id === "c/community");
  const packageListingPage = matches.find((m) => m.id === "p/packageListing");
  const packageEditPage = matches.find((m) => m.id === "p/packageEdit");
  const packageDependantsPage = matches.find(
    (m) => m.id === "p/dependants/Dependants"
  );
  const packageTeamPage = matches.find((m) => m.id === "p/team/Team");
  const packageFormatDocsPage = matches.find(
    (m) => m.id === "tools/package-format-docs/packageFormatDocs"
  );
  const manifestValidatorPage = matches.find(
    (m) => m.id === "tools/manifest-validator/manifestValidator"
  );
  const markdownPreviewPage = matches.find(
    (m) => m.id === "tools/markdown-preview/markdownPreview"
  );

  const shouldShowAds = location.pathname.startsWith("/teams")
    ? false
    : location.pathname.startsWith("/settings")
      ? false
      : location.pathname.startsWith("/package/create")
        ? false
        : location.pathname.startsWith("/tools")
          ? false
          : true;

  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#29295b" />
        <meta name="theme-color" content="#29295b" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#23ffb0" />
        <Links />
      </head>
      <body>
        {shouldUpdatePublicEnvVars && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.NIMBUS_PUBLIC_ENV = ${JSON.stringify(
                resolvedEnvVars
              )}`,
            }}
          />
        )}
        <div className="container container--y container--full island layout">
          <LinkingProvider value={LinkLibrary}>
            <Toast.Provider toastDuration={10000}>
              <TooltipProvider>
                <NavigationWrapper
                  domain={resolvedEnvVars?.VITE_API_URL || ""}
                  currentUser={data?.currentUser}
                />
                <div className="container container--x container--full island">
                  <main className="container container--x container--full island-item layout__main">
                    <section className="container container--y container--full layout__content">
                      {/* Breadcrumbs are build progressively */}
                      <NewBreadCrumbs>
                        {/* User Settings */}
                        {userSettingsPage ? (
                          userSettingsAccountPage ? (
                            <NewBreadCrumbsLink
                              primitiveType="cyberstormLink"
                              linkId="Settings"
                              csVariant="cyber"
                            >
                              Settings
                            </NewBreadCrumbsLink>
                          ) : (
                            <span>
                              <span>Settings</span>
                            </span>
                          )
                        ) : null}
                        {/* User Settings account */}
                        {userSettingsAccountPage ? (
                          <span>
                            <span>Account</span>
                          </span>
                        ) : null}
                        {/* Teams */}
                        {teamsPage || teamSettingsPage ? (
                          <NewBreadCrumbsLink
                            primitiveType="cyberstormLink"
                            linkId="Teams"
                            csVariant="cyber"
                          >
                            Teams
                          </NewBreadCrumbsLink>
                        ) : null}
                        {/* Team settings */}
                        {teamSettingsPage ? (
                          <NewBreadCrumbsLink
                            primitiveType="cyberstormLink"
                            linkId="Team"
                            csVariant="cyber"
                            team={teamSettingsPage.params.namespaceId}
                          >
                            {teamSettingsPage.params.namespaceId}
                          </NewBreadCrumbsLink>
                        ) : null}
                        {/* Team Settings Profile */}
                        {teamSettingsProfilePage ? (
                          <span>
                            <span>Profile</span>
                          </span>
                        ) : null}
                        {/* Team Settings Members */}
                        {teamSettingsMembersPage ? (
                          <span>
                            <span>Members</span>
                          </span>
                        ) : null}
                        {/* Team Settings Service Accounts */}
                        {teamSettingsServiceAccountsPage ? (
                          <span>
                            <span>Service Accounts</span>
                          </span>
                        ) : null}
                        {/* Team Settings Settings */}
                        {teamSettingsSettingsPage ? (
                          <span>
                            <span>Settings</span>
                          </span>
                        ) : null}
                        {/* Upload */}
                        {uploadPage ? (
                          <span>
                            <span>Upload</span>
                          </span>
                        ) : null}
                        {/* Communities page */}
                        {communitiesPage ||
                        communityPage ||
                        packageDependantsPage ||
                        packageTeamPage ? (
                          communityPage ||
                          packageDependantsPage ||
                          packageTeamPage ? (
                            <NewBreadCrumbsLink
                              primitiveType="cyberstormLink"
                              linkId="Communities"
                              csVariant="cyber"
                            >
                              Communities
                            </NewBreadCrumbsLink>
                          ) : (
                            <span>
                              <span>Communities</span>
                            </span>
                          )
                        ) : null}
                        {/* Community page */}
                        {getCommunityBreadcrumb(
                          communityPage ||
                            packageListingPage ||
                            packageDependantsPage ||
                            packageTeamPage,
                          Boolean(packageListingPage) ||
                            Boolean(packageDependantsPage) ||
                            Boolean(packageTeamPage)
                        )}
                        {/* Package listing page */}
                        {getPackageListingBreadcrumb(
                          packageListingPage,
                          packageEditPage,
                          packageDependantsPage
                        )}
                        {packageEditPage ? (
                          <span>
                            <span>Edit package</span>
                          </span>
                        ) : null}
                        {packageDependantsPage ? (
                          <span>
                            <span>Dependants</span>
                          </span>
                        ) : null}
                        {packageTeamPage ? (
                          <span>
                            <span>{packageTeamPage.params.namespaceId}</span>
                          </span>
                        ) : null}
                        {packageFormatDocsPage ? (
                          <span>
                            <span>Package Format Docs</span>
                          </span>
                        ) : null}
                        {manifestValidatorPage ? (
                          <span>
                            <span>Manifest Validator</span>
                          </span>
                        ) : null}
                        {markdownPreviewPage ? (
                          <span>
                            <span>Markdown Preview</span>
                          </span>
                        ) : null}
                      </NewBreadCrumbs>
                      {children}
                    </section>
                  </main>
                  {shouldShowAds ? (
                    <div className="container container--y island-item layout__ads">
                      <div className="container container--y layout__ads-inner">
                        {adContainerIds.map((cid, k_i) => (
                          <AdContainer key={k_i} containerId={cid} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <Footer />
                {shouldShowAds ? <AdsInit /> : null}
              </TooltipProvider>
            </Toast.Provider>
          </LinkingProvider>
          <ScrollRestoration />
          <Scripts />
          <BetaButtonInit />
        </div>
      </body>
    </html>
  );
}
