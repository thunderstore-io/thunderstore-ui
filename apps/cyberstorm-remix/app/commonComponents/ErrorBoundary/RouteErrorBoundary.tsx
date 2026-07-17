import * as Sentry from "@sentry/react-router";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import {
  heartbeatSuppressed4xx,
  isExpectedRouteError,
  toReportableError,
} from "cyberstorm/utils/sentry";
import { type JSX, useCallback, useEffect, useRef } from "react";
import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

type StatusCode = number | "???";

/**
 * Route level error boundary. Catches errors that occurred in
 * loader/clientLoader. Replaces the whole component with the
 * error message.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();

  // One forced session lookup shared by the classify + redirect effects below
  // — a 401 page would otherwise fetch /current-user twice. Forced (true)
  // because the cached user can't be trusted on a 401: an expired session
  // still has a stored "logged-in" user, which would misclassify the most
  // common 401 as an auth regression. Resolves to whether the session is
  // anonymous, or undefined when the lookup itself failed (env missing,
  // /api unreachable) so callers degrade instead of rejecting.
  const anonymousLookup = useRef<Promise<boolean | undefined> | null>(null);
  const resolveAnonymous = useCallback(() => {
    anonymousLookup.current ??= (async () => {
      try {
        const storedUser = await getSessionTools()?.getSessionCurrentUser(true);
        return !storedUser?.username;
      } catch {
        return undefined;
      }
    })();
    return anonymousLookup.current;
  }, []);

  // Seeing double console logs caused by React's strictMode (that
  // *should* happen only in dev mode) makes me want to ensure any
  // rerenders don't get logged in Sentry twice.
  useEffect(() => {
    if (!error) return;
    if (!import.meta.env.PROD) {
      console.error("Error boundary caught error", error);
      return;
    }
    let active = true;

    const classifyAndReport = async () => {
      // A 401 is expected for an anonymous user (redirected to login below)
      // but an auth regression for a logged-in one — resolve the session
      // before classifying (a failed lookup leaves anonymous undefined, so
      // the 401 is suppressed with a heartbeat). Other statuses don't need
      // session context.
      let anonymous: boolean | undefined;
      if (isApiError(error) && error.response.status === 401) {
        anonymous = await resolveAnonymous();
      }
      if (!active) return;

      if (isExpectedRouteError(error, { anonymous })) {
        // Suppressed as an individual event; a sampled, grouped trace keeps
        // storms of "expected" 4xx visible — see sentry.ts.
        heartbeatSuppressed4xx(error);
        return;
      }
      // Wrap react-router ErrorResponse objects so Sentry records a real
      // Error grouped by status instead of "Object captured as exception".
      // Reported 4xx ApiErrors get a per-status fingerprint so a storm (e.g.
      // Cloudflare 429s) spikes ONE alertable issue instead of scattering
      // across routes.
      Sentry.captureException(
        toReportableError(error),
        isApiError(error) &&
          error.response.status >= 400 &&
          error.response.status < 500
          ? { fingerprint: ["api-4xx", String(error.response.status)] }
          : undefined
      );
    };

    classifyAndReport();
    return () => {
      active = false;
    };
  }, [error, resolveAnonymous]);

  let statusCode: StatusCode = "???";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
  } else if (isApiError(error)) {
    statusCode = error.response.status;
  }

  // RouteErrorBoundary useEffect handles everything locally.
  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (statusCode === 401) {
        const anonymous = await resolveAnonymous();

        // Redirect only when the session is CONFIRMED anonymous; a failed
        // lookup (undefined) keeps the user on the error page instead of
        // bouncing them to login while /api is flaky.
        if (anonymous === true && active) {
          navigate(
            `/login?returnUrl=${encodeURIComponent(
              location.pathname + location.search + location.hash
            )}`,
            {
              replace: true,
            }
          );
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [
    statusCode,
    location.pathname,
    location.search,
    location.hash,
    navigate,
    resolveAnonymous,
  ]);

  const errorTitle = errorTitles[statusCode] ?? "Unexpected error";

  return (
    <>
      {/* React 19 hoists these into <head>. Error pages must never be indexed,
          and a real title beats the browser falling back to the raw URL. */}
      <title>{`${errorTitle} | Thunderstore`}</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="error-boundary">
        <h1
          className="error-boundary__flavor glitch layers"
          data-text={statusCode}
        >
          <span>{statusCode}</span>
        </h1>
        <h2 className="error-boundary__title">{errorTitle}</h2>
        <p className="error-boundary__description">
          {errorDescriptions[statusCode] ?? "Try again in a moment!"}
        </p>
      </div>
    </>
  );
}

RouteErrorBoundary.displayName = "RouteErrorBoundary";

const errorTitles: Record<StatusCode, string> = {
  400: "Sus request",
  401: "Papers, please",
  403: "Red keycard required",
  404: "Oops! Page not found",
  429: "Gotta go fast",
  500: "Uh oh! Something went wrong",
  502: "We are experiencing technical difficulties",
  503: "We are experiencing technical difficulties",
  504: "We are experiencing technical difficulties",
  "???": "Uh oh! Something went wrong",
};

const errorDescriptions: Record<StatusCode, JSX.Element | string> = {
  400: (
    <>
      Our server did not like the provided data.
      <br />
      Please check your request and try again.
    </>
  ),
  401: "You need to be logged in to access this page.",
  403: "You are not authorized to access this page.",
  404: (
    <>
      We can&apos;t seem to find the page you are looking for.
      <br />
      It might have been moved, deleted, or you&apos;ve taken a wrong turn.
    </>
  ),
  429: (
    <>
      But not that fast! You are making too many requests.
      <br />
      Please wait a moment and try again.
    </>
  ),
  500: "Our server tripped over its own cables. Try again in a moment!",
  502: "Our server can't be reached right now. Try again in a moment!",
  503: "Our server can't be reached right now. Try again in a moment!",
  504: "Our server can't be reached right now. Try again in a moment!",
  "???": "The browser did not enjoy our spaghetti code. Try again in a moment!",
};
