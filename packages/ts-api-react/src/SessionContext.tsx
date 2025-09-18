"use client";

import { StorageManager } from "./storage";
import {
  User,
  userSchema,
  EmptyUser,
  RequestConfig,
} from "@thunderstore/thunderstore-api";
// Probably shouldn't from Dapper, but what can you do when you need these.
// import { CurrentUser } from "@thunderstore/dapper/types";
import { DapperTs } from "@thunderstore/dapper-ts";
// import { CurrentUser } from "@thunderstore/dapper/types";

export interface ContextInterface {
  /** Remove session data from provider's state and localStorage. */
  clearSession: (clearApiHost?: boolean) => void;
  /** Remove session cookies. */
  clearCookies: (domain: string) => void;
  /** Set SessionData in storage */
  setSession: (sessionData: SessionData) => void;
  /** Set session stale state */
  setSessionStale: (isStale: boolean) => void;
  /** Get session stale state */
  getSessionStale: () => boolean;
  /** Get RequestConfig for Dapper usage */
  getConfig: (domain?: string) => RequestConfig;
  /** Check if session is valid and try to repair if not */
  sessionValid: (apiHost: string, cookieDomain: string) => boolean;
  /** apiHost of the session */
  apiHost?: string;
  /** Async function to update currentUser */
  updateCurrentUser: () => Promise<void>;
  /** Store given CurrentUser */
  storeCurrentUser: (currentUser: User) => void;
  /** Function to get the currentUser */
  getSessionCurrentUser: () => Promise<User | EmptyUser>;
}

interface SessionData {
  apiHost: string;
  cookieDomain: string;
  stale: "yes" | "no";
}

export const SESSION_STORAGE_KEY = "Session";
export const API_HOST_KEY = "apiHost";
export const STALE_KEY = "stale";
export const COOKIE_DOMAIN_KEY = "cookieDomain";

// CurrentUser objects keys
export const CURRENT_USER_KEY = "currentUser";

// Util functions
export const getCookie = (cookieName: string) => {
  const cookie = new RegExp(`${cookieName}=([^;]+);`).exec(
    document.cookie[-1] === ";" ? document.cookie : document.cookie + ";"
  )?.[1];
  return cookie ? cookie : null;
};

const deleteCookie = (name: string, domain: string) => {
  const date = new Date();
  date.setTime(0);
  document.cookie = `${name}=; domain=${domain}; expires=${date.toUTCString()}; path=/`;
};

// All Session functions
export const setSession = (
  _storage: StorageManager,
  sessionData: SessionData
) => {
  _storage.setValue(API_HOST_KEY, sessionData.apiHost);
  _storage.setValue(COOKIE_DOMAIN_KEY, sessionData.cookieDomain);
  _storage.setValue(STALE_KEY, sessionData.stale);
};

export const setSessionStale = (_storage: StorageManager, isStale: boolean) => {
  _storage.setValue(STALE_KEY, isStale ? "yes" : "no");
};

export const getSessionStale = (_storage: StorageManager) => {
  return _storage.safeGetValue(STALE_KEY) === "yes";
};

export const clearSession = (
  _storage: StorageManager,
  clearApiHost: boolean
) => {
  _storage.removeValue(CURRENT_USER_KEY);
  if (clearApiHost) {
    _storage.removeValue(API_HOST_KEY);
  }
};

export const clearCookies = (domain: string) => {
  deleteCookie("sessionid", domain);
};

export const getConfig = (
  _storage: StorageManager,
  domain?: string
): RequestConfig => {
  const apiHost = _storage.safeGetValue(API_HOST_KEY);
  return {
    // THIS IS NOT KOSHER
    apiHost: apiHost ? apiHost : domain ? domain : "",
    sessionId: getCookie("sessionid") ?? "",
  };
};

function parseCurrentUser(currentUser: unknown): User {
  const parsed = userSchema.safeParse(currentUser);
  if (!parsed.success) {
    throw new Error("Failed to parse current user");
  } else {
    return parsed.data;
  }
}

export const sessionValid = (
  _storage: StorageManager,
  apiHost: string,
  cookieDomain: string
): boolean => {
  const sessionidCookie = getCookie("sessionid");
  const storedApiHost = _storage.safeGetValue(API_HOST_KEY);
  const storedCookieDomain = _storage.safeGetValue(COOKIE_DOMAIN_KEY);
  const storedCurrentUser = _storage.safeGetJsonValue(CURRENT_USER_KEY);

  // Update apiHost incase it has changed
  if (storedApiHost !== apiHost) {
    _storage.setValue(API_HOST_KEY, apiHost);
  }

  // Update cookieDomain incase it has changed
  if (storedCookieDomain !== cookieDomain) {
    _storage.setValue(COOKIE_DOMAIN_KEY, cookieDomain);
  }

  if (sessionidCookie) {
    // sessionid present but no currentUser, session is stale
    if (storedCurrentUser === null) {
      _storage.setValue(STALE_KEY, "yes");
    }
    return true;
  }

  // sessionid missing but there is a currentUser, session is stale
  if (
    storedCurrentUser !== null &&
    parseCurrentUser(storedCurrentUser).username
  ) {
    _storage.setValue(STALE_KEY, "yes");
  }
  return false;
};

export const storeCurrentUser = (
  _storage: StorageManager,
  currentUser: User
) => {
  _storage.setJsonValue(CURRENT_USER_KEY, currentUser);
};

export const updateCurrentUser = async (
  _storage: StorageManager,
  customGetConfig?: (domain?: string) => RequestConfig,
  customClearSession?: () => void
) => {
  const dapper = new DapperTs(
    customGetConfig
      ? customGetConfig
      : (domain?: string) => getConfig(_storage, domain),
    customClearSession
      ? customClearSession
      : () => {
          // This function gets called when the dapper getCurrentUser gets 401 as a response
          clearSession(_storage, false);
          // We want to clear the sessionid cookie if it's invalid.
          clearCookies(_storage.safeGetValue(COOKIE_DOMAIN_KEY) || "");
        }
  );
  const currentUser = await dapper.getCurrentUser();
  // Only store the currentUser if it's not empty
  if (currentUser && currentUser.username !== null) {
    storeCurrentUser(_storage, currentUser);
  } else {
    _storage.removeValue(CURRENT_USER_KEY);
  }
  setSessionStale(_storage, false);
};

const emptyCurrentUser: EmptyUser = {
  username: null,
  capabilities: [],
  connections: [],
  subscription: {
    expires: null,
  },
  teams: [],
  teams_full: [],
};

export const getSessionCurrentUser = async (
  _storage: StorageManager
): Promise<User | EmptyUser> => {
  const isStale = _storage.safeGetValue(STALE_KEY);
  if (!(typeof isStale === "string") || !(isStale === "no")) {
    // If the session is stale, we need to refresh it
    await updateCurrentUser(_storage);
  }
  const currentUser = _storage.safeGetJsonValue(CURRENT_USER_KEY);

  if (currentUser === null) {
    return emptyCurrentUser;
  }
  return parseCurrentUser(currentUser);
};

export const getSessionContext = (
  apiHost: string,
  cookieDomain: string
): ContextInterface => {
  const _storage = new StorageManager(SESSION_STORAGE_KEY);

  const _setSession = (sessionData: SessionData) => {
    setSession(_storage, sessionData);
  };

  const _setSessionStale = (isStale: boolean) => {
    setSessionStale(_storage, isStale);
  };

  const _getSessionStale = () => {
    return getSessionStale(_storage);
  };

  const _clearSession = (clearApiHost: boolean = false) => {
    clearSession(_storage, clearApiHost);
  };

  const _clearCookies = (domain: string) => {
    clearCookies(domain);
  };

  const _getConfig = (domain?: string): RequestConfig => {
    return getConfig(_storage, domain);
  };

  // Check current session and try to fix it if cookies are not the same as storage
  const _sessionValid = (apiHost: string, cookieDomain: string): boolean => {
    return sessionValid(_storage, apiHost, cookieDomain);
  };

  const _storeCurrentUser = (currentUser: User) => {
    storeCurrentUser(_storage, currentUser);
  };

  const _updateCurrentUser = async () => {
    updateCurrentUser(_storage);
  };

  const _getSessionCurrentUser = () => {
    return getSessionCurrentUser(_storage);
  };

  if (typeof window !== "undefined") {
    const sessionidCookie = getCookie("sessionid");

    if (sessionidCookie) {
      _setSession({
        apiHost: apiHost,
        cookieDomain: cookieDomain,
        stale: "no",
      });
    } else {
      _storage.setValue(API_HOST_KEY, apiHost);
      _sessionValid(apiHost, cookieDomain);
    }
  }

  return {
    clearSession: _clearSession,
    clearCookies: _clearCookies,
    getConfig: _getConfig,
    sessionValid: _sessionValid,
    updateCurrentUser: _updateCurrentUser,
    storeCurrentUser: _storeCurrentUser,
    getSessionCurrentUser: _getSessionCurrentUser,
    setSession: _setSession,
    setSessionStale: _setSessionStale,
    getSessionStale: _getSessionStale,
    apiHost: apiHost,
  };
};
