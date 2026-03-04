import "./styles/index.css";

import { config } from "@fortawesome/fontawesome-svg-core";
// import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import { withSentry } from "@sentry/remix";
import { Breadcrumbs } from "app/commonComponents/Breadcrumbs/Breadcrumbs";
import {
  getPublicEnvVariables,
  getSessionTools,
  type publicEnvVariablesType,
} from "cyberstorm/security/publicEnvVariables";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { type ReactNode, memo, useEffect, useRef, useState } from "react";
import {
  Links,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useLocation,
  useMatches,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";

import {
  AdContainer,
  LinkingProvider,
  ToastProvider,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme/css";
import "@thunderstore/cyberstorm/css";
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

config.autoAddCss = false;

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
  return {
    publicEnvVariables: getPublicEnvVariables([
      "VITE_SITE_URL",
      "VITE_BETA_SITE_URL",
      "VITE_API_URL",
      "VITE_COOKIE_DOMAIN",
      "VITE_AUTH_BASE_URL",
      "VITE_AUTH_RETURN_URL",
      "VITE_CLIENT_SENTRY_DSN",
    ]),
    currentUser: undefined,
    config: {
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    },
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

  const communityId = matches.find((m) => m.params.communityId)?.params
    .communityId;

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
                  communityId={communityId}
                />
                <div className="container container--x container--full island">
                  <main className="container container--x container--full island-item layout__main">
                    <section className="container container--y container--full layout__content">
                      {/* Breadcrumbs are build progressively */}
                      <Breadcrumbs />
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
    () => data.config,
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
  const [adsScriptLoaded, setAdsScriptLoaded] = useState(
    typeof window !== "undefined" && typeof window.nitroAds !== "undefined"
  );

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;

    let $script: HTMLScriptElement | undefined;
    let cancelled = false;

    const loadAds = () => {
      if (typeof window === "undefined") {
        return;
      }

      if (typeof window.nitroAds === "undefined") {
        $script = document.createElement("script");
        $script.src = "https://s.nitropay.com/ads-785.js";
        $script.setAttribute("async", "true");
        $script.setAttribute("data-log-level", "silent");

        $script.onload = () => {
          if (!cancelled) {
            setAdsScriptLoaded(true);
          }
        };

        document.body.append($script);
      } else if (typeof window.nitroAds !== "undefined") {
        if (!cancelled) {
          setAdsScriptLoaded(true);
        }
      }
    };

    if (document.readyState === "complete") {
      loadAds();
    } else {
      window.addEventListener("load", loadAds);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", loadAds);
      if ($script) {
        $script.onload = null;
        $script.remove();
      }
    };
  }, []);

  const nitroAds = typeof window !== "undefined" ? window.nitroAds : undefined;
  useEffect(() => {
    if (
      adsScriptLoaded &&
      nitroAds !== undefined &&
      nitroAds.createAd !== undefined
    ) {
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
  }, [adsScriptLoaded, nitroAds]);

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
