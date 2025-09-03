import { getSessionContext } from "@thunderstore/ts-api-react/src/SessionContext";

export type publicEnvVariablesKeys =
  | "SITE_URL"
  | "BETA_SITE_URL"
  | "API_URL"
  | "COOKIE_DOMAIN"
  | "AUTH_BASE_URL"
  | "AUTH_RETURN_URL"
  | "CLIENT_SENTRY_DSN";

export type PublicPrefix<envVariable extends string> = `VITE_${envVariable}`;

export type publicEnvVariables = Partial<{
  [key in PublicPrefix<publicEnvVariablesKeys>]: string | undefined;
}>;

export function getPublicEnvVariables(
  vars: PublicPrefix<publicEnvVariablesKeys>[]
): publicEnvVariables {
  const returnedVars: publicEnvVariables = {};
  if (import.meta.env.SSR) {
    vars.forEach((envVar) => {
      if (envVar.startsWith("VITE_") && envVar in process.env) {
        returnedVars[envVar] = process.env[envVar];
      }
    });
  } else {
    vars.forEach((envVar) => {
      if (envVar.startsWith("VITE_") && envVar in window.ENV) {
        returnedVars[envVar] = window.ENV[envVar];
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
      "Enviroment variables did not load correctly, please hard refresh page"
    );
  }
  return getSessionContext(
    publicEnvVariables.VITE_API_URL,
    publicEnvVariables.VITE_COOKIE_DOMAIN
  );
}
