import { captureRemixErrorBoundaryError } from "@sentry/remix";
import { type JSX, useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

import { isApiError } from "@thunderstore/thunderstore-api";

import "./RouteErrorBoundary.css";

type StatusCode = number | "???";

/**
 * Route level error boundary. Catches errors that occurred in
 * loader/clientLoader. Replaces the whole component with the
 * error message.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  // Seeing double console logs caused by React's strictMode (that
  // *should* happen only in dev mode) makes me want to ensure any
  // rerenders don't get logged in Sentry twice.
  useEffect(() => {
    if (error && import.meta.env.PROD) {
      captureRemixErrorBoundaryError(error);
    } else if (error) {
      console.error("Error boundary caught error", error);
    }
  }, [error]);

  let statusCode: StatusCode = "???";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
  } else if (isApiError(error)) {
    statusCode = error.response.status;
  }

  return (
    <div className="error-boundary">
      <h1
        className="error-boundary__flavor glitch layers"
        data-text={statusCode}
      >
        <span>{statusCode}</span>
      </h1>
      <h2 className="error-boundary__title">
        {errorTitles[statusCode] ?? "Unexpected error"}
      </h2>
      <p className="error-boundary__description">
        {errorDescriptions[statusCode] ?? "Try again in a moment!"}
      </p>
    </div>
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
  502: "Our server can&apos;t be reached right now. Try again in a moment!",
  503: "Our server can&apos;t be reached right now. Try again in a moment!",
  504: "Our server can&apos;t be reached right now. Try again in a moment!",
  "???": "The browser did not enjoy our spaghetti code. Try again in a moment!",
};
