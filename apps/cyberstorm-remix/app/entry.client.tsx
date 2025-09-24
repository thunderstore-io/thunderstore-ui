import * as Sentry from "@sentry/remix";
import { useEffect, startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { useLocation, useMatches } from "react-router";
import { HydratedRouter } from "react-router/dom";

import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

const publicEnvVariables = getPublicEnvVariables([
  "VITE_SITE_URL",
  "VITE_BETA_SITE_URL",
  "VITE_API_URL",
  "VITE_AUTH_BASE_URL",
  "VITE_CLIENT_SENTRY_DSN",
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
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
