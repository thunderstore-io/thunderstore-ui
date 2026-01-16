import * as Sentry from "@sentry/remix";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { initializeClientDapper } from "cyberstorm/utils/dapperSingleton";
import { denyUrls } from "cyberstorm/utils/sentry";
import { StrictMode, startTransition, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { useLocation, useMatches } from "react-router";
import { HydratedRouter } from "react-router/dom";

const publicEnvVariables = getPublicEnvVariables([
  "VITE_SITE_URL",
  "VITE_BETA_SITE_URL",
  "VITE_API_URL",
  "VITE_AUTH_BASE_URL",
  "VITE_CLIENT_SENTRY_DSN",
  "VITE_COOKIE_DOMAIN",
]);

Sentry.init({
  dsn: publicEnvVariables.VITE_CLIENT_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    // Replay is only available in the client
    Sentry.replayIntegration(),
  ],

  beforeBreadcrumb: (
    breadcrumb: Sentry.Breadcrumb
  ): Sentry.Breadcrumb | null => {
    if (breadcrumb.category === "fetch" || breadcrumb.category === "xhr") {
      const breadcrumbUrl = breadcrumb.data?.url;
      if (
        typeof breadcrumbUrl === "string" &&
        ((publicEnvVariables.VITE_AUTH_BASE_URL &&
          breadcrumbUrl.startsWith(publicEnvVariables.VITE_AUTH_BASE_URL)) ||
          (publicEnvVariables.VITE_API_URL &&
            breadcrumbUrl.startsWith(publicEnvVariables.VITE_API_URL)) ||
          (publicEnvVariables.VITE_BETA_SITE_URL &&
            breadcrumbUrl.startsWith(publicEnvVariables.VITE_BETA_SITE_URL)) ||
          (publicEnvVariables.VITE_SITE_URL &&
            breadcrumbUrl.startsWith(publicEnvVariables.VITE_SITE_URL)))
      ) {
        return breadcrumb;
      } else {
        return null;
      }
    } else {
      return breadcrumb;
    }
  },

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Filter out e.g. ad related domains that may spam errors.
  denyUrls,
});

try {
  const sessionTools = getSessionTools();

  initializeClientDapper(() =>
    sessionTools.getConfig(publicEnvVariables.VITE_API_URL)
  );
} catch (error) {
  Sentry.captureException(error);
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
