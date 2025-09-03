import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { useLocation, useMatches } from "react-router";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

const sentryClientDSN = getPublicEnvVariables([
  "VITE_CLIENT_SENTRY_DSN",
]).VITE_CLIENT_SENTRY_DSN;

Sentry.init({
  dsn: sentryClientDSN,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    // Replay is only available in the client
    Sentry.replayIntegration(),
  ],

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
