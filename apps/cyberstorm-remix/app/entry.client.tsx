import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { ContextInterface, SessionProvider } from "@thunderstore/ts-api-react";
import { DapperTs } from "@thunderstore/dapper-ts";

const publicEnvVars = getPublicEnvVariables([
  "PUBLIC_CLIENT_SENTRY_DSN",
  "PUBLIC_API_URL",
]);

const sessionProvider = SessionProvider({
  apiHost: publicEnvVars.PUBLIC_API_URL ?? "MISSING_API_HOST",
});

const { clearSession, getConfig } = sessionProvider.props
  .value as ContextInterface;

// INIT DAPPER
window.Dapper = new DapperTs(getConfig, () => {
  clearSession();
});

Sentry.init({
  dsn: publicEnvVars.PUBLIC_CLIENT_SENTRY_DSN,
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
      <RemixBrowser />
    </StrictMode>
  );
});
