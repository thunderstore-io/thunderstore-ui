import { isRecord } from "cyberstorm/utils/typeChecks";

/**
 *
 * @returns host address for Thunderstore API.
 * @throws if non-empty URL is not defined in the environment variables.
 *         Throws a Response object which gets handled by the error boundary.
 */
export function getApiHostForSsr(): string {
  let apiHost: string | undefined;

  if (isRecord(process.env)) {
    apiHost = process.env?.VITE_API_URL;
  }

  if (!apiHost) {
    throw new Response(null, {
      status: 500,
      statusText: "API URL not configured",
      headers: { "Content-Type": "application/json" },
    });
  }

  return apiHost;
}
