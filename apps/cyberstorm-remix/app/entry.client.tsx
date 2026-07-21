import * as Sentry from "@sentry/react-router";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { initializeClientDapper } from "cyberstorm/utils/dapperSingleton";
import { hardenDomAgainstTranslation } from "cyberstorm/utils/hardenDom";
import {
  beforeSend,
  denyUrls,
  isBoundaryOwned4xx,
  isExpectedRouteError,
  toReportableError,
} from "cyberstorm/utils/sentry";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
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
  // No replayIntegration. It was previously configured with both replay sample
  // rates at 0, so it recorded nothing while still shipping ~124 KiB (a third
  // of entry.client) and running its DOM instrumentation on every page load;
  // the integration and those two options were removed together. Re-adding it
  // means setting a sample rate above 0 as well — and preferably lazy-loading
  // it, since it is by far the largest thing in the entry bundle.

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

  // Filter out e.g. ad related domains that may spam errors.
  denyUrls,
  beforeSend,
});

try {
  const sessionTools = getSessionTools();

  initializeClientDapper(() =>
    sessionTools.getConfig(publicEnvVariables.VITE_API_URL)
  );
} catch (error) {
  Sentry.captureException(error);
}

// Translators/extensions mutate the DOM React owns; harden node removal
// before hydration so that does not white-screen the app.
hardenDomAgainstTranslation();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter
        onError={(error, info) => {
          // Client-side navigations to unmatched URLs surface here as 404
          // ErrorResponses; they are expected traffic, not bugs. Without
          // session context 401s are also skipped here — RouteErrorBoundary
          // sees the same loader errors, resolves the session (reporting
          // logged-in 401s) and emits the suppressed-4xx heartbeat.
          if (isExpectedRouteError(error)) return;
          // Every 4xx is boundary-owned — RouteErrorBoundary reports it
          // (wrapped + per-status fingerprint), so capturing here double-bills.
          // Covers BOTH shapes: raw ApiErrors AND loader-thrown
          // RouteErrorResponse objects (which, captured raw, become a useless
          // "Object captured as exception with keys: ..." event).
          if (isBoundaryOwned4xx(error)) return;
          // 5xx / non-HTTP reach here too and dedupe with the boundary; wrap so
          // a RouteErrorResponse object records a real Error, not "Object
          // captured as exception".
          Sentry.sentryOnError(toReportableError(error), info);
        }}
      />
    </StrictMode>
  );
});
