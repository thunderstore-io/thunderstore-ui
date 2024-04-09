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

type PublicConfigType = {
  PUBLIC_API_URL: string;
  PUBLIC_SITE_URL: string;

  // OAuth
  PUBLIC_AUTH_DISCORD_URL: string | undefined;
  PUBLIC_AUTH_GITHUB_URL: string | undefined;
  PUBLIC_AUTH_OVERWOLF_URL: string | undefined;
  PUBLIC_AUTH_RETURN_URL: string | undefined;
};

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
const DEV_CONFIG: Partial<PublicConfigType> = {
  PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  PUBLIC_AUTH_DISCORD_URL: process.env.NEXT_PUBLIC_AUTH_DISCORD_URL,
  PUBLIC_AUTH_GITHUB_URL: process.env.NEXT_PUBLIC_AUTH_GITHUB_URL,
  PUBLIC_AUTH_OVERWOLF_URL: process.env.NEXT_PUBLIC_AUTH_OVERWOLF_URL,
  PUBLIC_AUTH_RETURN_URL: process.env.NEXT_PUBLIC_AUTH_RETURN_URL,
};

if (process.env.NODE_ENV === "development") {
  for (const key in Object.keys(DEV_CONFIG)) {
    const val = DEV_CONFIG[key as keyof PublicConfigType];
    if (val !== undefined) {
      PUBLIC_CONFIG[key as keyof PublicConfigType] = val;
    }
  }
}

export function getPublicApiUrl(): string {
  return PUBLIC_CONFIG.PUBLIC_API_URL;
}

export function getPublicSiteUrl(): string | undefined {
  return PUBLIC_CONFIG.PUBLIC_SITE_URL;
}

export function getPublicAuthConfig() {
  if (!PUBLIC_CONFIG.PUBLIC_AUTH_RETURN_URL) {
    return {};
  }

  const buildUrl = (prefix: string | undefined) => {
    if (!prefix) return undefined;
    return `${prefix}${PUBLIC_CONFIG.PUBLIC_AUTH_RETURN_URL}`;
  };

  return {
    discordAuthUrl: buildUrl(PUBLIC_CONFIG.PUBLIC_AUTH_DISCORD_URL),
    githubAuthUrl: buildUrl(PUBLIC_CONFIG.PUBLIC_AUTH_GITHUB_URL),
    overwolfAuthUrl: buildUrl(PUBLIC_CONFIG.PUBLIC_AUTH_OVERWOLF_URL),
  };
}

export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET;
}

export function getAuthEnabled(): string | undefined {
  return process.env.AUTH_ENABLED;
}
