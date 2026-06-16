import "./styles/cyberstorm.css";

import { config } from "@fortawesome/fontawesome-svg-core";
// import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import rybbit from "@rybbit/js";
import { Breadcrumbs } from "app/commonComponents/Breadcrumbs/Breadcrumbs";
import {
  ROOT_PUBLIC_ENV_VARIABLES,
  getPublicEnvVariables,
  getSessionTools,
  type publicEnvVariablesType,
} from "cyberstorm/security/publicEnvVariables";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { type ReactNode, memo, useEffect, useRef, useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useLocation,
  useMatches,
  useRouteLoaderData,
} from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";

import {
  AdContainer,
  Container,
  LinkingProvider,
  ToastProvider,
} from "@thunderstore/cyberstorm";
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
import {
  BOTTOM_BANNER_AD_SLOTS,
  BOTTOM_RIGHT_AD_SLOTS,
  type NitroAds,
  RIGHT_COLUMN_SLOTS,
  createAllNimbusAds,
  onNavigateNimbusAds,
  teardownNimbusAds,
} from "./commonComponents/Ads/nitroAds";
import { Footer } from "./commonComponents/Footer/Footer";
import { Island, IslandContainer } from "./commonComponents/Island/Island";
import { NavigationWrapper } from "./commonComponents/Navigation/NavigationWrapper";
import { Seo } from "./commonComponents/Seo/Seo";

config.autoAddCss = false;

// Bottom ad row disabled (TS-3954) due to poor viewability, pending
// reassessment. Flip to true to bring the full-width bottom banner + its
// companions back; the slot config and CSS are left intact for an easy revert.
const BOTTOM_ADS_ENABLED = false;

// REMIX TODO: https://remix.run/docs/en/main/route/links
// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

declare global {
  interface Window {
    NIMBUS_PUBLIC_ENV: publicEnvVariablesType;
    Dapper: DapperTs;
    nitroAds?: NitroAds;
  }
}

export type OutletContextShape = {
  currentUser: CurrentUser | undefined;
  requestConfig: () => RequestConfig;
  domain: string;
  dapper: DapperTs;
};

const rootSeo = createSeo({
  descriptors: [
    { title: "Thunderstore" },
    {
      name: "description",
      content: "An ecosystem for sharing mods for games!",
    },
    { name: "msapplication-TileColor", content: "#29295b" },
    { name: "theme-color", content: "#29295b" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
});

// Account/settings routes: user settings (`/settings`) and team management
// (`/teams`). Declared once so the route checks below can't drift apart.
// Entering these pages forces a current-user refetch + revalidation, and
// analytics tracking is suppressed on them.
const ACCOUNT_ROUTE_PREFIXES = ["/settings", "/teams"];

const isAccountRoute = (pathname: string) =>
  ACCOUNT_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

// Rybbit `skipPatterns` derived from the same prefixes. The matcher anchors
// patterns as `^...$`, so each prefix needs both the exact route and a `/**`
// glob to also cover its sub-routes (e.g. /settings/account, /teams/:id/members).
const ANALYTICS_SKIP_PATTERNS = ACCOUNT_ROUTE_PREFIXES.flatMap((prefix) => [
  prefix,
  `${prefix}/**`,
]);

// Rybbit `maskPatterns`: keep the pageview but drop the query string (unlike
// skipPatterns, which drops the pageview). /login carries a `returnUrl` that may
// be sensitive.
const ANALYTICS_MASK_PATTERNS = ["/login"];

export async function loader() {
  return {
    publicEnvVariables: getPublicEnvVariables(ROOT_PUBLIC_ENV_VARIABLES),
    currentUser: undefined,
    config: {
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    },
    seo: rootSeo,
  };
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const publicEnvVariables = getPublicEnvVariables(ROOT_PUBLIC_ENV_VARIABLES);
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
  const url = new URL(request.url);
  if (isAccountRoute(url.pathname)) {
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
    seo: rootSeo,
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
  if (isAccountRoute(nextUrl.pathname)) return true;
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

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<RootLoadersType>("root");
  let envVars = undefined;
  let shouldUpdatePublicEnvVars = false;
  if (import.meta.env.SSR) {
    envVars = getPublicEnvVariables(ROOT_PUBLIC_ENV_VARIABLES);
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

  // Kill switch for local development and tests (set VITE_DISABLE_ADS=true).
  const adsDisabled = resolvedEnvVars?.VITE_DISABLE_ADS === "true";
  const shouldShowAds = adsDisabled
    ? false
    : location.pathname.startsWith("/teams")
      ? false
      : location.pathname.startsWith("/settings")
        ? false
        : location.pathname.startsWith("/package/create")
          ? false
          : location.pathname.startsWith("/tools")
            ? false
            : true;

  // Tell NitroPay a new pageview happened on client-side navigation. Without
  // this an entire SPA session is one long-lived pageview on a refresh timer,
  // which depresses CPM and drives the ad CPU churn. We key on pathname AND
  // search so package-search pagination/filtering (which only change the query
  // string) also count as pageviews. The initial pageview is handled by
  // createAd, so the first run only records the key; comparing against the last
  // key also makes this resilient to React StrictMode's mount double-invoke.
  // Refreshes are throttled inside onNavigateNimbusAds (MIN_AD_LIFETIME_MS),
  // with NitroPay's per-slot `onNavigateMin` as belt-and-braces.
  const lastAdNavKey = useRef<string | null>(null);
  useEffect(() => {
    const navKey = `${location.pathname}${location.search}`;
    if (lastAdNavKey.current === null || lastAdNavKey.current === navKey) {
      lastAdNavKey.current = navKey;
      return;
    }
    lastAdNavKey.current = navKey;
    onNavigateNimbusAds();
  }, [location.pathname, location.search]);

  return (
    <html lang="en">
      <head>
        {/*
          We define CSS layers inline at the very top of the head to guarantee they are registered
          before any other styles (bundled or otherwise) are processed. This prevents specificity
          issues where bundler chunk ordering could otherwise cause unlayered styles to override
          our layer system.
        */}
        <style>
          {`@layer utils, colors, layout, components, overrides, theme, theme-utils, theme-colors, theme-layout, theme-components, theme-components-sizes, theme-components-colors, theme-components-layouts, theme-components-miscs, nimbus, nimbus-utils, nimbus-colors, nimbus-layout, nimbus-components, nimbus-components-sizes, nimbus-components-colors, nimbus-components-layouts, nimbus-components-miscs, nimbus-overrides;`}
        </style>
        <Seo />
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
        <LinkingProvider value={LinkLibrary}>
          <ToastProvider toastDuration={10000}>
            <TooltipProvider>
              <IslandContainer direction="y" rootClasses="width-100">
                <NavigationWrapper
                  domain={resolvedEnvVars?.VITE_API_URL || ""}
                  currentUser={data?.currentUser}
                  communityId={communityId}
                />
                <IslandContainer direction="x">
                  <Island
                    as="main"
                    id="main-content"
                    tabIndex={-1}
                    rootClasses="layout__main flex--grow-1"
                  >
                    <Container size="narrow">
                      <Breadcrumbs />
                      {children}
                    </Container>
                  </Island>
                  {shouldShowAds && (
                    <Island rootClasses="layout__ads">
                      <div className="layout__ads-stack">
                        {RIGHT_COLUMN_SLOTS.map((slot) => (
                          <AdContainer
                            key={slot.containerId}
                            containerId={slot.containerId}
                            sizeVariant={slot.sizeVariant}
                          />
                        ))}
                      </div>
                    </Island>
                  )}
                </IslandContainer>
                {shouldShowAds && BOTTOM_ADS_ENABLED ? (
                  <Island rootClasses="flex--x layout__bottom-ads">
                    <div className="layout__bottom-ads-banners">
                      {BOTTOM_BANNER_AD_SLOTS.map((slot) => (
                        <AdContainer
                          key={slot.containerId}
                          containerId={slot.containerId}
                          sizeVariant={slot.sizeVariant}
                        />
                      ))}
                    </div>
                    {BOTTOM_RIGHT_AD_SLOTS.map((slot) => (
                      <AdContainer
                        key={slot.containerId}
                        containerId={slot.containerId}
                        sizeVariant={slot.sizeVariant}
                      />
                    ))}
                  </Island>
                ) : null}
                <Footer domain={resolvedEnvVars?.VITE_API_URL || ""} />
                {shouldShowAds ? <AdsInit /> : null}
              </IslandContainer>
            </TooltipProvider>
          </ToastProvider>
        </LinkingProvider>
        <ScrollRestoration />
        <Scripts />
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

  useEffect(() => {
    const siteId = data?.publicEnvVariables.VITE_RYBBIT_SITE_ID;
    const analyticsHost = data?.publicEnvVariables.VITE_RYBBIT_ANALYTICS_HOST;
    if (!siteId || !analyticsHost) return;

    // Rybbit auto-tracks outbound link clicks including the query string, and the
    // /auth/* login/logout links carry a `next`/`returnUrl` that may be sensitive.
    // Register our capture-phase listener before Rybbit's (added async in init
    // below) and stopImmediatePropagation for auth-link clicks so Rybbit never
    // sees them. No preventDefault, and these are plain <a href> with no onClick,
    // so navigation and every other click are unaffected.
    const suppressAnalyticsForAuthLinks = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;
      let pathname: string;
      try {
        pathname = new URL(anchor.href, window.location.href).pathname;
      } catch {
        return;
      }
      if (pathname.startsWith("/auth/")) {
        event.stopImmediatePropagation();
      }
    };
    document.addEventListener("click", suppressAnalyticsForAuthLinks, true);

    rybbit
      .init({
        analyticsHost,
        siteId,
        skipPatterns: ANALYTICS_SKIP_PATTERNS,
        maskPatterns: ANALYTICS_MASK_PATTERNS,
      })
      .catch(console.error);

    return () => {
      document.removeEventListener(
        "click",
        suppressAnalyticsForAuthLinks,
        true
      );
    };
  }, [
    data?.publicEnvVariables.VITE_RYBBIT_SITE_ID,
    data?.publicEnvVariables.VITE_RYBBIT_ANALYTICS_HOST,
  ]);

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

export default App;
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

        $script.onerror = () => {
          // Ad script blocked or unreachable (adblock, CSP, network). Drop the
          // dangling <script> tag; adsScriptLoaded stays false so no ads are
          // created and the fallback message remains visible.
          $script?.remove();
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
        $script.onerror = null;
        $script.remove();
      }
    };
  }, []);

  // Create the slots once per mount. The ref is set when the deferred creation
  // actually fires (not when scheduled), so React StrictMode's dev
  // double-invoke — whose first-pass cleanup cancels the pending callback —
  // still creates the ads exactly once. A real remount is a fresh component
  // with a fresh ref, so returning from an ad-suppressed route re-creates the
  // slots on the new containers.
  const hasCreatedAds = useRef(false);
  useEffect(() => {
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    // Read window.nitroAds inside the effect rather than depending on it:
    // re-running on its identity change would tear the registry down (cleanup)
    // without re-creating it (the hasCreatedAds latch), killing onNavigate
    // refreshes for the rest of the session.
    const nitroAds =
      typeof window !== "undefined" ? window.nitroAds : undefined;

    if (
      !hasCreatedAds.current &&
      adsScriptLoaded &&
      nitroAds !== undefined &&
      nitroAds.createAd !== undefined
    ) {
      const create = () => {
        hasCreatedAds.current = true;
        createAllNimbusAds(nitroAds);
      };

      // Defer slot creation to main-thread idle time so the ad auctions never
      // contend with hydration/interaction work; the timeout bounds how long
      // a busy page may delay the first impressions. Safari has no
      // requestIdleCallback — fall back to a short timeout there.
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(create, { timeout: 2000 });
      } else {
        timeoutHandle = setTimeout(create, 200);
      }
    }

    // Cancel a still-pending creation and forget the slot refs when this
    // unmounts (e.g. navigating to an ad-suppressed route) so returning
    // re-creates them on fresh containers.
    return () => {
      if (idleHandle !== undefined) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
      teardownNimbusAds();
    };
  }, [adsScriptLoaded]);

  return <></>;
}
