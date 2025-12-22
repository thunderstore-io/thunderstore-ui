// import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import { withSentry } from "@sentry/remix";
import {
  getPublicEnvVariables,
  getSessionTools,
  type publicEnvVariablesType,
} from "cyberstorm/security/publicEnvVariables";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import { type ReactNode, Suspense, memo, useEffect, useRef } from "react";
import {
  Await,
  Links,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
  type UIMatch,
  useLoaderData,
  useLocation,
  useMatches,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";

import {
  AdContainer,
  LinkingProvider,
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  ToastProvider,
  isRecord,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { DapperTs } from "@thunderstore/dapper-ts";
import { type CurrentUser } from "@thunderstore/dapper/types";
import { type RequestConfig } from "@thunderstore/thunderstore-api";
import {
  NamespacedStorageManager,
  SESSION_STORAGE_KEY,
  StorageManager,
  getSessionContext,
  getSessionStale,
  runSessionValidationCheck,
} from "@thunderstore/ts-api-react";

import type { Route } from "./+types/root";
import { Footer } from "./commonComponents/Footer/Footer";
import { NavigationWrapper } from "./commonComponents/Navigation/NavigationWrapper";
import "./styles/index.css";

// REMIX TODO: https://remix.run/docs/en/main/route/links
// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

declare global {
  interface Window {
    NIMBUS_PUBLIC_ENV: publicEnvVariablesType;
    Dapper: DapperTs;
    nitroAds?: {
      createAd: (
        containerId: string,
        params: {
          demo: boolean;
          format: string;
          refreshLimit: number;
          refreshTime: number;
          renderVisibleOnly: boolean;
          refreshVisibleOnly: boolean;
          sizes: string[][];
          report: {
            enabled: boolean;
            wording: string;
            position: string;
          };
          mediaQuery: string;
        }
      ) => void;
    };
  }
}

export type OutletContextShape = {
  currentUser: CurrentUser | undefined;
  requestConfig: () => RequestConfig;
  domain: string;
  dapper: DapperTs;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Thunderstore" },
    {
      name: "description",
      content: "Thunderstore, the place to be. And to find mods!",
    },
  ];
};

export async function loader() {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_SITE_URL",
    "VITE_BETA_SITE_URL",
    "VITE_API_URL",
    "VITE_COOKIE_DOMAIN",
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
    "VITE_CLIENT_SENTRY_DSN",
  ]);
  const config: RequestConfig = {
    apiHost: publicEnvVariables.VITE_API_URL,
    sessionId: undefined,
  };
  return {
    publicEnvVariables: publicEnvVariables,
    currentUser: undefined,
    config,
  };
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_SITE_URL",
    "VITE_BETA_SITE_URL",
    "VITE_API_URL",
    "VITE_COOKIE_DOMAIN",
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
    "VITE_CLIENT_SENTRY_DSN",
  ]);
  if (
    !publicEnvVariables.VITE_API_URL ||
    !publicEnvVariables.VITE_COOKIE_DOMAIN
  ) {
    throw new Error(
      "Enviroment variables did not load correctly, please hard refresh page"
    );
  }
  const sessionTools = getSessionContext(
    publicEnvVariables.VITE_API_URL,
    publicEnvVariables.VITE_COOKIE_DOMAIN
  );

  let forceUpdateCurrentUser = false;
  if (
    request.url.startsWith(`${publicEnvVariables.VITE_BETA_SITE_URL}/teams`) ||
    request.url.startsWith(`${publicEnvVariables.VITE_BETA_SITE_URL}/settings`)
  ) {
    forceUpdateCurrentUser = true;
  } else {
    // In all other cases check if actually need to fetch
    // current-user data. Ideally we shouldn't need to do
    // this runSessionValidationCheck check again, but for some reason
    // we need to run this here too in addition to the,
    // shouldRevalidate function, cause for some reason
    // the commits to localStorage are not done before
    // the clientLoader is run.
    sessionTools.runSessionValidationCheck(
      publicEnvVariables.VITE_API_URL,
      publicEnvVariables.VITE_COOKIE_DOMAIN
    );
  }
  const currentUser = await sessionTools.getSessionCurrentUser(
    forceUpdateCurrentUser
  );
  const config = sessionTools.getConfig(publicEnvVariables.VITE_API_URL);
  return {
    publicEnvVariables: publicEnvVariables,
    currentUser: currentUser.username ? currentUser : undefined,
    config,
  };
}

export type RootLoadersType = typeof loader | typeof clientLoader;

// We want to force revalidation when session is stale
// TODO: Currently when logging in, the revalidation wont be run on the redirect back to the page
// this needs to be fixed, but it requires a more in-depth solution
export function shouldRevalidate({
  defaultShouldRevalidate,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_API_URL",
    "VITE_COOKIE_DOMAIN",
  ]);
  if (
    nextUrl.pathname.startsWith("/teams") ||
    nextUrl.pathname.startsWith("/settings")
  )
    return true;
  runSessionValidationCheck(
    new StorageManager(SESSION_STORAGE_KEY),
    publicEnvVariables.VITE_API_URL || "",
    publicEnvVariables.VITE_COOKIE_DOMAIN || ""
  );
  const sessionIsStale = getSessionStale(
    new NamespacedStorageManager(SESSION_STORAGE_KEY)
  );
  return sessionIsStale || defaultShouldRevalidate;
}

clientLoader.hydrate = true;

const adContainerIds = ["right-column-1", "right-column-2", "right-column-3"];

export function Layout({ children }: { children: React.ReactNode }) {
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
  const packageVersionPage = matches.find((m) => m.id === "p/packageVersion");
  const packageVersionWithoutCommunityPage = matches.find(
    (m) => m.id === "p/packageVersionWithoutCommunity"
  );
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
            <ToastProvider toastDuration={10000}>
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
                            linkId="TeamSettings"
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
                            packageTeamPage ||
                            packageVersionPage,
                          Boolean(packageListingPage) ||
                            Boolean(packageDependantsPage) ||
                            Boolean(packageTeamPage) ||
                            Boolean(packageVersionPage)
                        )}
                        {/* Package listing page */}
                        {getPackageListingBreadcrumb(
                          packageListingPage,
                          packageEditPage,
                          packageDependantsPage
                        )}
                        {/* Package Version Page */}
                        {packageVersionPage ? (
                          <>
                            <NewBreadCrumbsLink
                              primitiveType="cyberstormLink"
                              linkId="Package"
                              community={packageVersionPage.params.communityId}
                              namespace={packageVersionPage.params.namespaceId}
                              package={packageVersionPage.params.packageId}
                              csVariant="cyber"
                            >
                              {packageVersionPage.params.packageId}
                            </NewBreadCrumbsLink>
                            <span>
                              <span>
                                {packageVersionPage.params.packageVersion}
                              </span>
                            </span>
                          </>
                        ) : null}
                        {/* Package version without community Page */}
                        {packageVersionWithoutCommunityPage ? (
                          <>
                            <span>
                              <span>
                                {
                                  packageVersionWithoutCommunityPage.params
                                    .namespaceId
                                }
                              </span>
                            </span>
                            <span>
                              <span>
                                {
                                  packageVersionWithoutCommunityPage.params
                                    .packageId
                                }
                              </span>
                            </span>
                            <span>
                              <span>
                                {
                                  packageVersionWithoutCommunityPage.params
                                    .packageVersion
                                }
                              </span>
                            </span>
                          </>
                        ) : null}
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
            </ToastProvider>
          </LinkingProvider>
          <ScrollRestoration />
          <Scripts />
          <BetaButtonInit />
        </div>
      </body>
    </html>
  );
}

const TooltipProvider = memo(function TooltipProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <RadixTooltip delayDuration={80}>{children}</RadixTooltip>;
});

function App() {
  const data = useLoaderData<RootLoadersType>();
  const sessionTools = getSessionTools();
  const dapper = new DapperTs(
    () => {
      return {
        apiHost: data?.publicEnvVariables.VITE_API_URL,
        sessionId: data?.config.sessionId,
      };
    },
    () =>
      sessionTools.clearInvalidSession(
        data?.publicEnvVariables.VITE_COOKIE_DOMAIN
      )
  );

  return (
    <Outlet
      context={{
        currentUser: data?.currentUser,
        requestConfig: dapper.config,
        domain: data?.publicEnvVariables.VITE_API_URL,
        dapper: dapper,
      }}
    />
  );
}

export default withSentry(App);
export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

// Temporary solution for implementing ads
// REMIX TODO: Move to dynamic html
function AdsInit() {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    if (
      typeof window !== "undefined" &&
      typeof window.nitroAds === "undefined"
    ) {
      const $script = document.createElement("script");
      $script.src = "https://s.nitropay.com/ads-785.js";
      $script.setAttribute("async", "true");
      $script.setAttribute("data-log-level", "silent");

      document.body.append($script);

      return () => $script.remove();
    }
  }, []);

  const nitroAds = typeof window !== "undefined" ? window.nitroAds : undefined;
  useEffect(() => {
    if (nitroAds !== undefined && nitroAds.createAd !== undefined) {
      adContainerIds.forEach((cid) => {
        if (nitroAds !== undefined && nitroAds.createAd !== undefined) {
          nitroAds.createAd(cid, {
            demo: false,
            format: "display",
            refreshLimit: 0,
            refreshTime: 30,
            renderVisibleOnly: true,
            refreshVisibleOnly: true,
            sizes: [["300", "250"]],
            report: {
              enabled: true,
              wording: "Report Ad",
              position: "bottom-right",
            },
            mediaQuery: "(min-width: 1475px) and (min-height: 400px)",
          });
        }
      });
    }
  }, [nitroAds]);

  return <></>;
}

// Temporary solution for adding the beta button
// REMIX TODO: Move to dynamic html
function BetaButtonInit() {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);
  const hasRun = useRef(false);

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if ((!startsHydrated.current && isHydrated) || hasRun.current) return;
    if (typeof window !== "undefined") {
      const $script = document.createElement("script");
      $script.src = "/cyberstorm-static/scripts/beta-switch.js";
      $script.setAttribute("async", "true");

      document.body.append($script);
      hasRun.current = true;

      return () => $script.remove();
    }
  }, []);

  return <></>;
}

function getCommunityBreadcrumb(
  communityPage: UIMatch | undefined,
  isNotLast: boolean
) {
  if (!communityPage) return null;
  return (
    <>
      {communityPage &&
      isRecord(communityPage.data) &&
      Object.prototype.hasOwnProperty.call(communityPage.data, "community") ? (
        <Suspense
          fallback={
            <span>
              <span>Loading...</span>
            </span>
          }
        >
          <Await resolve={communityPage.data.community}>
            {(resolvedValue) => {
              let label = undefined;
              let icon = undefined;
              if (isRecord(resolvedValue)) {
                label =
                  Object.prototype.hasOwnProperty.call(resolvedValue, "name") &&
                  typeof resolvedValue.name === "string"
                    ? resolvedValue.name
                    : communityPage.params.communityId;
                icon =
                  Object.prototype.hasOwnProperty.call(
                    resolvedValue,
                    "community_icon_url"
                  ) && typeof resolvedValue.community_icon_url === "string" ? (
                    <img src={resolvedValue.community_icon_url} alt="" />
                  ) : undefined;
              }
              return isNotLast ? (
                <NewBreadCrumbsLink
                  primitiveType="cyberstormLink"
                  linkId="Community"
                  community={communityPage.params.communityId}
                  csVariant="cyber"
                >
                  {icon}
                  {label}
                </NewBreadCrumbsLink>
              ) : (
                <span>
                  <span>
                    {icon}
                    {label}
                  </span>
                </span>
              );
            }}
          </Await>
        </Suspense>
      ) : null}
    </>
  );
}

function getPackageListingBreadcrumb(
  packageListingPage: UIMatch | undefined,
  packageEditPage: UIMatch | undefined,
  packageDependantsPage: UIMatch | undefined
) {
  if (!packageListingPage && !packageEditPage && !packageDependantsPage)
    return null;
  return (
    <>
      {packageListingPage ? (
        <span>
          <span>{packageListingPage.params.packageId}</span>
        </span>
      ) : null}
      {packageEditPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageEditPage.params.communityId}
          namespace={packageEditPage.params.namespaceId}
          package={packageEditPage.params.packageId}
          csVariant="cyber"
        >
          {packageEditPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
      {packageDependantsPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageDependantsPage.params.communityId}
          namespace={packageDependantsPage.params.namespaceId}
          package={packageDependantsPage.params.packageId}
          csVariant="cyber"
        >
          {packageDependantsPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
    </>
  );
}
