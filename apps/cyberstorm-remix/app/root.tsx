import "./styles/index.css";
import "@thunderstore/cyberstorm-theme";
import {
  Links,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useMatches,
  useRouteError,
} from "react-router";
// import { LinksFunction } from "@remix-run/react/dist/routeModules";

import { DapperTs } from "@thunderstore/dapper-ts";
import { type CurrentUser } from "@thunderstore/dapper/types";

import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import { type RequestConfig } from "@thunderstore/thunderstore-api";
import { NamespacedStorageManager } from "@thunderstore/ts-api-react";
import {
  getSessionContext,
  getSessionStale,
  SESSION_STORAGE_KEY,
  runSessionValidationCheck,
} from "@thunderstore/ts-api-react/src/SessionContext";
import {
  getPublicEnvVariables,
  type publicEnvVariablesType,
} from "cyberstorm/security/publicEnvVariables";
import { StorageManager } from "@thunderstore/ts-api-react/src/storage";
import { type Route } from "./+types/root";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import Toast from "@thunderstore/cyberstorm/src/newComponents/Toast";
import { TooltipProvider } from "./rootRoute/tooltipProvider";
import { NavigationWrapper } from "./commonComponents/Navigation/NavigationWrapper";
import { BetaButtonInit } from "./rootRoute/betaButton";
import { Ads, AdsInit } from "./rootRoute/nitroAds";
import { Footer } from "./commonComponents/Footer/Footer";
import { NimbusBreadcrumbs } from "./rootRoute/breadcrumbs";

// REMIX TODO: https://remix.run/docs/en/main/route/links
// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

/**
 * Declaring window types that are present, because of the parts of the application that use these
 *
 * NIMBUS_PUBLIC_ENV: Public environment variables made available to the client and used at least by getPublicEnvVariables
 *
 * Dapper: DapperTs instance for making API calls, used in many of the clientLoaders
 *
 * nitroAds: NitroAds ad service instance, used by the Ads component
 */
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

/* React router outlet context shape. This shape should be present on all pages. Pages might define additional context for their children */
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

/* Loaders start */
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
// Force hydration of client loader on the initial page load
clientLoader.hydrate = true;
/* Loaders end */

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

// Layout component to provide common UI around all pages
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
                      <NimbusBreadcrumbs matches={matches} />
                      {children}
                    </section>
                  </main>
                  <Ads shouldShow={shouldShowAds} />
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

function App() {
  const data = useLoaderData<RootLoadersType>();
  const dapper = new DapperTs(() => {
    return {
      apiHost: data?.publicEnvVariables.VITE_API_URL,
      sessionId: data?.config.sessionId,
    };
  });

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

// We wrap the App in Sentry's withSentry to catch errors and send them to Sentry
export default withSentry(App);

// ErrorBoundary to catch errors in the app and display a friendly message
export function ErrorBoundary() {
  const error = useRouteError();
  if (import.meta.env.PROD) {
    captureRemixErrorBoundaryError(error);
  } else if (import.meta.env.DEV) {
    // In development mode, we log the error to the console
    console.error(error);
  }
  const isResponseError = isRouteErrorResponse(error);
  return (
    <div className="error">
      <div
        className="error__glitch"
        data-text={isResponseError ? error.status : 500}
      >
        <span>{isResponseError ? error.status : 500}</span>
      </div>
      <div className="error__description">
        {isResponseError ? error.data : "Internal server error"}
      </div>
      {!isResponseError && (
        <div className="error__flavor">
          Beep boop. Server something error happens.
        </div>
      )}
    </div>
  );
}
