export type publicEnvVariablesKeys =
  | "SITE_URL"
  | "API_URL"
  | "CLIENT_SENTRY_DSN";

export type PublicPrefix<envVariable extends string> = `PUBLIC_${envVariable}`;

export type publicEnvVariables = Partial<{
  [key in PublicPrefix<publicEnvVariablesKeys>]: string | undefined;
}>;

export function getPublicEnvVariables(
  vars: PublicPrefix<publicEnvVariablesKeys>[]
): publicEnvVariables {
  const returnedVars: publicEnvVariables = {};
  if (typeof process !== "undefined" && process.env) {
    vars.forEach((envVar) => {
      if (envVar.startsWith("PUBLIC_") && envVar in process.env) {
        returnedVars[envVar] = process.env[envVar];
      }
    });
  } else if (typeof window !== "undefined" && window.ENV) {
    vars.forEach((envVar) => {
      if (envVar.startsWith("PUBLIC_") && envVar in window.ENV) {
        returnedVars[envVar] = window.ENV[envVar];
      }
    });
  }
  return returnedVars;
}
