import "@thunderstore/cyberstorm-styles";
import styles from "./RootLayout.module.css";
import errorStyles from "./Error.module.css";
import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
// import { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Footer } from "@thunderstore/cyberstorm/src/components/Footer/Footer";
import * as RadixTooltip from "@radix-ui/react-tooltip";
const { TooltipProvider } = RadixTooltip;

import { Navigation } from "cyberstorm/navigation/Navigation";
import { LinkLibrary } from "cyberstorm/utils/LinkLibrary";
import { AdContainer, LinkingProvider } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { CurrentUser } from "@thunderstore/dapper/types";
import { getDapper } from "cyberstorm/dapper/sessionUtils";

import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import {
  getPublicEnvVariables,
  publicEnvVariables,
} from "cyberstorm/security/publicEnvVariables";
import { useEffect, useRef } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import Toast from "@thunderstore/cyberstorm/src/components/Toast";
import { SessionProvider } from "@thunderstore/ts-api-react";

// REMIX TODO: https://remix.run/docs/en/main/route/links
// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

declare global {
  interface Window {
    ENV: publicEnvVariables;
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
  const dapper = await getDapper();

  return {
    envStuff: {
      ENV: getPublicEnvVariables([
        "PUBLIC_API_URL",
        "PUBLIC_CLIENT_SENTRY_DSN",
        "PUBLIC_SITE_URL",
      ]),
    },
    currentUser: await dapper.getCurrentUser(),
  };
}

export async function clientLoader() {
  const dapper = await getDapper(true);

  return {
    envStuff: {
      ENV: getPublicEnvVariables([
        "PUBLIC_API_URL",
        "PUBLIC_CLIENT_SENTRY_DSN",
        "PUBLIC_SITE_URL",
      ]),
    },
    currentUser: await dapper.getCurrentUser(),
  };
}

// REMIX TODO: Do we want to force a hydration at the root level?
// clientLoader.hydrate = true;

const adContainerIds = ["right-column-1", "right-column-2", "right-column-3"];

function Root() {
  const loaderOutput = useLoaderData<typeof loader | typeof clientLoader>();
  const parsedLoaderOutput: {
    envStuff: {
      ENV: publicEnvVariables;
    };
    sessionId: string | null;
    currentUser: CurrentUser;
  } = JSON.parse(JSON.stringify(loaderOutput));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              parsedLoaderOutput.envStuff.ENV
            )}`,
          }}
        />
        <SessionProvider
          domain={parsedLoaderOutput.envStuff.ENV.PUBLIC_API_URL}
        >
          <LinkingProvider value={LinkLibrary}>
            <Toast.Provider toastDuration={10000}>
              <TooltipProvider delayDuration={300}>
                <div className={styles.root}>
                  <Navigation user={parsedLoaderOutput.currentUser} />
                  <section className={styles.content}>
                    <div className={styles.sideContainers} />
                    <div className={styles.middleContainer}>
                      <Outlet />
                    </div>
                    <div className={styles.sideContainers}>
                      {adContainerIds.map((cid, k_i) => (
                        <AdContainer key={k_i} containerId={cid} noHeader />
                      ))}
                    </div>
                  </section>
                  <Footer />
                </div>
              </TooltipProvider>
            </Toast.Provider>
          </LinkingProvider>
        </SessionProvider>
        <ScrollRestoration />
        <Scripts />
        <AdsInit />
      </body>
    </html>
  );
}

// REMIX TODO: We don't have any data available in the root ErrorBoundary, so we might want to change the designs
export function ErrorBoundary() {
  // REMIX TODO: We need to call the loader separately somehow to get the CurrentUser
  // const loaderOutput = useLoaderData<typeof loader | typeof clientLoader>();
  // const parsedLoaderOutput: {
  //   envStuff: { ENV: { PUBLIC_API_URL: string } };
  //   sessionId: string | null;
  //   currentUser: CurrentUser;
  // } = JSON.parse(JSON.stringify(loaderOutput));
  const error = useRouteError();
  if (process.env.NODE_ENV === "production") {
    captureRemixErrorBoundaryError(error);
  } else if (process.env.NODE_ENV === "development") {
    console.log(error);
  }
  const isResponseError = isRouteErrorResponse(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${process.env.PUBLIC_API_URL}`,
          }}
        /> */}
        <Scripts />
        <LinkingProvider value={LinkLibrary}>
          <Toast.Provider toastDuration={10000}>
            <TooltipProvider delayDuration={300}>
              <div className={styles.root}>
                {/* <Navigation user={getEmptyUser} /> */}
                <section className={styles.content}>
                  <div className={styles.sideContainers} />
                  <div className={styles.middleContainer}>
                    <div className={errorStyles.root}>
                      <div
                        className={errorStyles.glitch}
                        data-text={isResponseError ? error.status : 500}
                      >
                        <span>{isResponseError ? error.status : 500}</span>
                      </div>
                      <div className={errorStyles.description}>
                        {isResponseError ? error.data : "Internal server error"}
                      </div>
                      {!isResponseError && (
                        <div className={errorStyles.flavor}>
                          Beep boop. Server something error happens.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.sideContainers}></div>
                </section>
                <Footer />
              </div>
            </TooltipProvider>
          </Toast.Provider>
        </LinkingProvider>
      </body>
    </html>
  );
}

export default withSentry(Root);

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

      document.body.append($script);

      return () => $script.remove();
    }
  }, []);

  const nitroAds = typeof window !== "undefined" ? window.nitroAds : undefined;
  useEffect(() => {
    if (nitroAds !== undefined) {
      adContainerIds.forEach((cid) => {
        if (nitroAds !== undefined) {
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
