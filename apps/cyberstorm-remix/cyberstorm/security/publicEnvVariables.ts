import { getSessionContext } from "@thunderstore/ts-api-react";

import { isRecord } from "../utils/typeChecks";

export type publicEnvVariablesKeys =
  | "SITE_URL"
  | "BETA_SITE_URL"
  | "API_URL"
  | "COOKIE_DOMAIN"
  | "AUTH_BASE_URL"
  | "AUTH_RETURN_URL"
  | "CLIENT_SENTRY_DSN"
  | "RYBBIT_SITE_ID"
  | "RYBBIT_ANALYTICS_HOST"
  | "DISABLE_ADS";

export type PublicPrefix<envVariable extends string> = `VITE_${envVariable}`;

export type publicEnvVariablesType = Partial<{
  [key in PublicPrefix<publicEnvVariablesKeys>]: string | undefined;
}>;

// Every public env var the root route exposes to the client. Single source for
// the SSR loader, the client loader, and Layout's SSR fallback (root.tsx), so
// the three can never drift apart — a key missing from one of them surfaces as
// an env var that is undefined in exactly one render mode.
export const ROOT_PUBLIC_ENV_VARIABLES: PublicPrefix<publicEnvVariablesKeys>[] =
  [
    "VITE_SITE_URL",
    "VITE_BETA_SITE_URL",
    "VITE_API_URL",
    "VITE_COOKIE_DOMAIN",
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
    "VITE_CLIENT_SENTRY_DSN",
    "VITE_RYBBIT_SITE_ID",
    "VITE_RYBBIT_ANALYTICS_HOST",
    "VITE_DISABLE_ADS",
  ];

export function getPublicEnvVariables(
  vars: PublicPrefix<publicEnvVariablesKeys>[]
): publicEnvVariablesType {
  const returnedVars: publicEnvVariablesType = {};
  if (import.meta.env.SSR) {
    vars.forEach((envVar) => {
      if (
        process.env !== undefined &&
        isRecord(process.env) &&
        envVar.startsWith("VITE_") &&
        Object.prototype.hasOwnProperty.call(process.env, envVar)
      ) {
        returnedVars[envVar] = process.env[envVar];
      }
    });
  } else {
    vars.forEach((envVar) => {
      if (
        window !== undefined &&
        Object.prototype.hasOwnProperty.call(window, "NIMBUS_PUBLIC_ENV") &&
        isRecord(window.NIMBUS_PUBLIC_ENV) &&
        envVar.startsWith("VITE_") &&
        Object.prototype.hasOwnProperty.call(window.NIMBUS_PUBLIC_ENV, envVar)
      ) {
        returnedVars[envVar] = window.NIMBUS_PUBLIC_ENV[envVar];
      }
    });
  }
  return returnedVars;
}

export function getSessionTools() {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_API_URL",
    "VITE_COOKIE_DOMAIN",
  ]);
  if (
    !publicEnvVariables.VITE_API_URL ||
    !publicEnvVariables.VITE_COOKIE_DOMAIN
  ) {
    throw new Error(
      "Environment variables did not load correctly, please hard refresh page"
    );
  }
  return getSessionContext(
    publicEnvVariables.VITE_API_URL,
    publicEnvVariables.VITE_COOKIE_DOMAIN
  );
}
