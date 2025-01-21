export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

type rootLoaderType = {
  root: {
    envStuff: {
      ENV: {
        PUBLIC_API_URL?: string;
        PUBLIC_CLIENT_SENTRY_DSN?: string;
        PUBLIC_SITE_URL?: string;
      };
    };
  };
};

export const isRootLoaderData = (obj: unknown): obj is rootLoaderType =>
  isRecord(obj) &&
  isRecord(obj.root) &&
  isRecord(obj.root.envStuff) &&
  isRecord(obj.root.envStuff.ENV) &&
  (typeof obj.root.envStuff.ENV.PUBLIC_API_URL === "string" ||
    typeof obj.root.envStuff.ENV.PUBLIC_API_URL === "undefined") &&
  (typeof obj.root.envStuff.ENV.PUBLIC_CLIENT_SENTRY_DSN === "string" ||
    typeof obj.root.envStuff.ENV.PUBLIC_CLIENT_SENTRY_DSN === "undefined") &&
  (typeof obj.root.envStuff.ENV.PUBLIC_SITE_URL === "string" ||
    typeof obj.root.envStuff.ENV.PUBLIC_SITE_URL === "undefined");

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
  } else if (
    typeof window !== "undefined" &&
    typeof window.__remixContext.state.loaderData !== "undefined" &&
    isRootLoaderData(window.__remixContext.state.loaderData)
  ) {
    const availableENV =
      window.__remixContext.state.loaderData.root.envStuff.ENV;
    vars.forEach((envVar) => {
      if (envVar.startsWith("PUBLIC_") && envVar in availableENV) {
        returnedVars[envVar] = availableENV[envVar];
      }
    });
  }
  return returnedVars;
}
