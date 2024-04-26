type PublicConfigType = {
  PUBLIC_API_URL: string;
  PUBLIC_SITE_URL: string;

  // OAuth
  PUBLIC_AUTH_DISCORD_URL: string | undefined;
  PUBLIC_AUTH_GITHUB_URL: string | undefined;
  PUBLIC_AUTH_OVERWOLF_URL: string | undefined;
  PUBLIC_AUTH_RETURN_URL: string | undefined;
};

function setupConfig(): PublicConfigType {
  // The value of this variable will be replaced as a pre-launch step by a script
  // as NextJS doesn't support dynamic configuration without re-building otherwise.

  // The default value is {"config": "placeholder"} encoded as base64 and it's what
  // the pre-launch script is looking for when doing a search & replace.

  // Base64 is used to avoid having to deal with nested string escapes in various
  // configuration pipelines which would likely be required otherwise as json is
  // used.

  // This is only necessary for pre-built files which NextJS serves from cache, so
  // only publicly exposed variables should be included here.
  const PUBLIC_PAYLOAD = "eyJjb25maWciOiAicGxhY2Vob2xkZXIifQ==";

  // Defaults are initialized as a standalone object to benefit from type checks
  // fully.
  const DEFAULT_CONFIG: PublicConfigType = {
    PUBLIC_API_URL: "https://thunderstore.io",
    PUBLIC_SITE_URL: "https://thunderstore.io",

    PUBLIC_AUTH_DISCORD_URL: undefined,
    PUBLIC_AUTH_GITHUB_URL: undefined,
    PUBLIC_AUTH_OVERWOLF_URL: undefined,
    PUBLIC_AUTH_RETURN_URL: undefined,
  };

  const PUBLIC_CONFIG: PublicConfigType = {
    ...DEFAULT_CONFIG,
    ...JSON.parse(Buffer.from(PUBLIC_PAYLOAD, "base64").toString("utf-8")),
  };

  // To retain dev environment configurability, explicitly set environment
  // variables are patched in when the server is ran in development mode
  function setDevModeVars() {
    // We can't place process.env calls in any constants, since NextJS will otherwise
    // bundle that into a pre-build, which then causes these not to update.
    if (process.env.NODE_ENV === "development") {
      if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_API_URL"] = process.env.NEXT_PUBLIC_API_URL;
      }
      if (process.env.NEXT_PUBLIC_SITE_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_SITE_URL"] = process.env.NEXT_PUBLIC_SITE_URL;
      }
      if (process.env.NEXT_PUBLIC_AUTH_DISCORD_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_AUTH_DISCORD_URL"] =
          process.env.NEXT_PUBLIC_AUTH_DISCORD_URL;
      }
      if (process.env.NEXT_PUBLIC_AUTH_GITHUB_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_AUTH_GITHUB_URL"] =
          process.env.NEXT_PUBLIC_AUTH_GITHUB_URL;
      }
      if (process.env.NEXT_PUBLIC_AUTH_OVERWOLF_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_AUTH_OVERWOLF_URL"] =
          process.env.NEXT_PUBLIC_AUTH_OVERWOLF_URL;
      }
      if (process.env.NEXT_PUBLIC_AUTH_RETURN_URL !== undefined) {
        PUBLIC_CONFIG["PUBLIC_AUTH_RETURN_URL"] =
          process.env.NEXT_PUBLIC_AUTH_RETURN_URL;
      }
    }
  }

  setDevModeVars();
  return PUBLIC_CONFIG;
}

interface GlobalContext {
  Cyberstorm?: PublicConfigType;
}

function getGlobalContext(): GlobalContext {
  if (typeof window === "undefined") {
    return globalThis as unknown as GlobalContext;
  } else {
    if (globalThis as unknown) {
      return globalThis as unknown as GlobalContext;
    } else {
      return window as unknown as GlobalContext;
    }
  }
}

function getConfig(): PublicConfigType {
  const context = getGlobalContext();
  if (!context.Cyberstorm) {
    context.Cyberstorm = setupConfig();
  }
  return context.Cyberstorm;
}

export function getPublicApiUrl(): string {
  return getConfig().PUBLIC_API_URL;
}

export function getPublicSiteUrl(): string | undefined {
  return getConfig().PUBLIC_SITE_URL;
}

export function getPublicAuthConfig() {
  const config = getConfig();
  if (!config.PUBLIC_AUTH_RETURN_URL) {
    return {};
  }

  const buildUrl = (prefix: string | undefined) => {
    if (!prefix) return undefined;
    return `${prefix}${config.PUBLIC_AUTH_RETURN_URL}`;
  };

  return {
    discordAuthUrl: buildUrl(config.PUBLIC_AUTH_DISCORD_URL),
    githubAuthUrl: buildUrl(config.PUBLIC_AUTH_GITHUB_URL),
    overwolfAuthUrl: buildUrl(config.PUBLIC_AUTH_OVERWOLF_URL),
  };
}

export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET;
}

export function getAuthEnabled(): string | undefined {
  return process.env.AUTH_ENABLED;
}
