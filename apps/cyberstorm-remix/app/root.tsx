import "./styles/cyberstorm.css";

import { config } from "@fortawesome/fontawesome-svg-core";
// import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import { Breadcrumbs } from "app/commonComponents/Breadcrumbs/Breadcrumbs";
import {
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
import { Footer } from "./commonComponents/Footer/Footer";
import { Island, IslandContainer } from "./commonComponents/Island/Island";
import { NavigationWrapper } from "./commonComponents/Navigation/NavigationWrapper";
import { Seo } from "./commonComponents/Seo/Seo";

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
        params:
          | {
              format: "display";
              demo?: boolean;
              refreshLimit?: number;
              refreshTime?: number;
              renderVisibleOnly?: boolean;
              refreshVisibleOnly?: boolean;
              sizes: string[][];
              report: {
                enabled: boolean;
                wording: string;
                position: string;
              };
              mediaQuery: string;
            }
          | {
              format: "video";
              demo?: boolean;
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

const rootSeo = createSeo({
  descriptors: [
    { title: "Thunderstore" },
    {
      name: "description",
      content: "A ecosystem for sharing mods for games!",
    },
    { name: "msapplication-TileColor", content: "#29295b" },
    { name: "theme-color", content: "#29295b" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
});

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
    seo: rootSeo,
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
  const url = new URL(request.url);
  if (
    url.pathname.startsWith("/teams") ||
    url.pathname.startsWith("/settings")
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

// Per-slot min-height thresholds align with the CSS hide breakpoints in
// app/styles/layout.css so NitroPay does not instantiate ads in slots that
// CSS would render `display: none`. Keep these values in sync with that file.
const adContainerSlots = [
  { containerId: "right-column-1", minHeight: 526 },
  { containerId: "right-column-2", minHeight: 801 },
  { containerId: "right-column-3", minHeight: 1076 },
] as const;
const adContainerIds = adContainerSlots.map((slot) => slot.containerId);

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<RootLoadersType>("root");
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
                  <Island rootClasses="layout__main flex--grow-1">
                    <Container size="narrow">
                      <Breadcrumbs />
                      {children}
                    </Container>
                  </Island>
                  {shouldShowAds && (
                    <Island rootClasses="layout__ads">
                      {adContainerIds.map((cid, k_i) => (
                        <AdContainer key={k_i} containerId={cid} />
                      ))}
                      <AdContainer
                        containerId={"bottom-video-ad"}
                        videoAd={true}
                      />
                    </Island>
                  )}
                </IslandContainer>
                <Footer />
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
      adContainerSlots.forEach(({ containerId, minHeight }) => {
        nitroAds.createAd(containerId, {
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
          mediaQuery: `(min-width: 1475px) and (min-height: ${minHeight}px)`,
        });
      });
      nitroAds.createAd("bottom-video-ad", {
        demo: false,
        format: "video",
        report: {
          enabled: true,
          wording: "Report Ad",
          position: "bottom-right",
        },
        mediaQuery: "(min-width: 1475px) and (min-height: 250px)",
      });
    }
  }, [adsScriptLoaded, nitroAds]);

  return <></>;
}
