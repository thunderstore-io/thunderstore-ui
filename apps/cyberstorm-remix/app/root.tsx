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
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { CurrentUser } from "@thunderstore/dapper/types";
import { getDapper } from "cyberstorm/dapper/sessionUtils";

import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";

// REMIX TODO: https://remix.run/docs/en/main/route/links
// export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return [
    { title: "Thunderstore" },
    {
      name: "description",
      content: "Thunderstore, the place to be. And to find mods!",
    },
  ];
};

declare global {
  interface Window {
    ENV: {
      PUBLIC_SITE_URL: string;
      PUBLIC_API_URL: string;
      SENTRY_DSN: string | undefined;
    };
    Dapper: DapperTs;
  }
}

export async function loader() {
  const dapper = await getDapper();

  return {
    envStuff: {
      ENV: {
        PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
        PUBLIC_API_URL: process.env.PUBLIC_API_URL,
        SENTRY_DSN: process.env.SENTRY_DSN,
      },
    },
    currentUser: await dapper.getCurrentUser(),
  };
}

export async function clientLoader() {
  const dapper = await getDapper(true);

  return {
    envStuff: {
      ENV: {
        PUBLIC_SITE_URL: window.ENV.PUBLIC_SITE_URL,
        PUBLIC_API_URL: window.ENV.PUBLIC_API_URL,
        SENTRY_DSN: window.ENV.SENTRY_DSN,
      },
    },
    currentUser: await dapper.getCurrentUser(),
  };
}

// REMIX TODO: Do we want to force a hydration at the root level?
// clientLoader.hydrate = true;

function Root() {
  const loaderOutput = useLoaderData<typeof loader | typeof clientLoader>();
  const parsedLoaderOutput: {
    envStuff: {
      ENV: {
        PUBLIC_API_URL: string;
        PUBLIC_SITE_URL: string;
        SENTRY_DSN: string | undefined;
      };
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
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              parsedLoaderOutput.envStuff.ENV
            )}`,
          }}
        />
        <Scripts />
        {/* REMIX TODO: This Ads script seem to break hydration for styles in the head. */}
        {/* <script async src={`https://s.nitropay.com/ads-785.js`} /> */}
        <LinkingProvider value={LinkLibrary}>
          <TooltipProvider>
            <div className={styles.root}>
              <Navigation user={parsedLoaderOutput.currentUser} />
              <section className={styles.content}>
                <div className={styles.sideContainers} />
                <div className={styles.middleContainer}>
                  <Outlet />
                </div>
                <div className={styles.sideContainers}>
                  {/* <AdContainer
                  containerId="right-column-1"
                  context={AdContext}
                  noHeader
                />
                <AdContainer
                  containerId="right-column-2"
                  context={AdContext}
                  noHeader
                />
                <AdContainer
                  containerId="right-column-3"
                  context={AdContext}
                  noHeader
                /> */}
                </div>
              </section>
              <Footer />
            </div>
          </TooltipProvider>
        </LinkingProvider>
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
          <TooltipProvider>
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
                <div className={styles.sideContainers}>
                  {/* <AdContainer
                  containerId="right-column-1"
                  context={AdContext}
                  noHeader
                />
                <AdContainer
                  containerId="right-column-2"
                  context={AdContext}
                  noHeader
                />
                <AdContainer
                  containerId="right-column-3"
                  context={AdContext}
                  noHeader
                /> */}
                </div>
              </section>
              <Footer />
            </div>
          </TooltipProvider>
        </LinkingProvider>
      </body>
    </html>
  );
}

export default withSentry(Root);
