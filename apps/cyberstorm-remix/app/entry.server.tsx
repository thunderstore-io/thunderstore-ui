import { createReadableStreamFromReadable } from "@react-router/node";
import * as Sentry from "@sentry/react-router";
import { isExpectedRouteError } from "cyberstorm/utils/sentry";
import * as isbotModule from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext, HandleErrorFunction } from "react-router";
import { ServerRouter } from "react-router";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
});

const ABORT_DELAY = 5_000;

// Defense-in-depth security headers applied to every SSR HTML document response.
// NOTE: Content-Security-Policy is intentionally NOT set here — enforcing a CSP
// against the third-party ad/analytics stack needs a tuned, report-only rollout
// first, so it is tracked separately rather than shipped blind. X-Frame-Options
// is SAMEORIGIN (not DENY) to avoid breaking any first-party embedding.
function applySecurityHeaders(headers: Headers) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const prohibitOutOfOrderStreaming =
    isBotRequest(request.headers.get("user-agent")) ||
    reactRouterContext.isSpaMode;

  return prohibitOutOfOrderStreaming
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext
      );
}

// We have some Remix apps in the wild already running with isbot@3 so we need
// to maintain backwards compatibility even though we want new apps to use
// isbot@4.  That way, we can ship this as a minor Semver update to @remix-run/dev.
function isBotRequest(userAgent: string | null) {
  if (!userAgent) {
    return false;
  }

  // isbot >= 3.8.0, >4
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }

  // isbot < 3.8.0
  // if ("default" in isbotModule && typeof isbotModule.default === "function") {
  //   return isbotModule.default(userAgent);
  // }

  return false;
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const path = new URL(request.url).pathname;
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        // abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          applySecurityHeaders(responseHeaders);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          Sentry.captureException(error, {
            tags: {
              handler: "bot",
              phase: "onShellError",
              path,
              method: request.method,
            },
          });
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            Sentry.captureException(error, {
              tags: {
                handler: "bot",
                phase: "onError",
                path,
                method: request.method,
              },
            });
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const path = new URL(request.url).pathname;
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        // abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          applySecurityHeaders(responseHeaders);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          Sentry.captureException(error, {
            tags: {
              handler: "browser",
              phase: "onShellError",
              path,
              method: request.method,
            },
          });
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            Sentry.captureException(error, {
              tags: {
                handler: "browser",
                phase: "onError",
                path,
                method: request.method,
              },
            });
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

const sentryHandleError = Sentry.createSentryHandleError({ logErrors: false });

// React Router routes its internal 404/405 ErrorResponses (unmatched URLs,
// invalid request methods, POSTs without an action) through handleError,
// and createSentryHandleError captures everything except aborted requests.
export const handleError: HandleErrorFunction = (error, args) => {
  if (isExpectedRouteError(error)) return;
  sentryHandleError(error, args);
};
