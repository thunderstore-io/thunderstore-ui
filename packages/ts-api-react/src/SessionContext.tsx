"use client";
import {
  createContext,
  // Dispatch,
  PropsWithChildren,
  // SetStateAction,
  useContext,
  // useState,
} from "react";

import { StorageManager } from "./storage";
import {
  User,
  userSchema,
  EmptyUser,
  emptyUserSchema,
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
  clearCookies: () => void;
  /** Set SessionData in storage */
  setSession: (sessionData: SessionData) => void;
  /** Get RequestConfig for Dapper usage */
  getConfig: (domain?: string) => RequestConfig;
  /** Check if session is valid and try to repair if not */
  sessionValid: () => boolean;
  /** apiHost of the session */
  apiHost?: string;
  /** Async function to update currentUser */
  updateCurrentUser: () => Promise<void>;
  /** Store given CurrentUser */
  storeCurrentUser: (currentUser: User) => void;
  /** Function to get the currentUser */
  getSessionCurrentUser: (forceUpdateCurrentUser?: boolean) => User | EmptyUser;
}

interface SessionData {
  apiHost: string;
  sessionId: string;
  username: string;
}

const SessionContext = createContext<ContextInterface | null>(null);
export const ID_KEY = "id";
export const USERNAME_KEY = "username";
export const API_HOST_KEY = "apiHost";

// CurrentUser objects keys
export const CURRENT_USER_KEY = "currentUser";

interface Props extends PropsWithChildren {
  apiHost: string;
}

/**
 * For managing data API's session id.
 *
 * This app has two backend: Remix backend mostly used for SSR, and
 * Django API backend for fetching actual data. The session id for
 * authenticating with the latter is stored in the localStorage, and
 * should be accessed via this convenience provider.
 */

export function SessionProvider(props: Props) {
  const _storage = new StorageManager("Session");

  const _setSession = (sessionData: SessionData) => {
    setSession(_storage, sessionData);
  };

  const _clearSession = (clearApiHost: boolean = false) => {
    clearSession(_storage, clearApiHost);
  };

  const _clearCookies = () => {
    clearCookies();
  };

  const _getConfig = (domain?: string): RequestConfig => {
    return getConfig(_storage, domain);
  };

  // Check current session and try to fix it if cookies are not the same as storage
  const _sessionValid = (): boolean => {
    return sessionValid(_storage);
  };

  const _storeCurrentUser = (currentUser: User) => {
    storeCurrentUser(_storage, currentUser);
  };

  const _updateCurrentUser = async () => {
    updateCurrentUser(_storage);
  };

  const _getSessionCurrentUser = (forceUpdateCurrentUser: boolean = false) => {
    return getSessionCurrentUser(_storage, forceUpdateCurrentUser);
  };

  if (typeof window !== "undefined") {
    const sessionidCookie = getCookie("sessionid");

    if (sessionidCookie) {
      _setSession({
        sessionId: sessionidCookie,
        username: "",
        apiHost: props.apiHost,
      });
    } else {
      _storage.setValue(API_HOST_KEY, props.apiHost);
      _sessionValid();
    }
  }

  const value = {
    clearSession: _clearSession,
    clearCookies: _clearCookies,
    getConfig: _getConfig,
    sessionValid: _sessionValid,
    updateCurrentUser: _updateCurrentUser,
    storeCurrentUser: _storeCurrentUser,
    getSessionCurrentUser: _getSessionCurrentUser,
    setSession: _setSession,
    apiHost: props.apiHost,
  };

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}

// Util functions
const getCookie = (cookieName: string) => {
  const cookie = new RegExp(`${cookieName}=([^;]+);`).exec(
    document.cookie[-1] === ";" ? document.cookie : document.cookie + ";"
  )?.[1];
  return cookie ? cookie : null;
};

const deleteCookie = (name: string) => {
  const date = new Date();
  date.setTime(0);
  document.cookie = `${name}=${null}; expires=${date.toUTCString()}; path=/`;
};

// All Session functions
export const setSession = (
  _storage: StorageManager,
  sessionData: SessionData
) => {
  _storage.setValue(API_HOST_KEY, sessionData.apiHost);
  _storage.setValue(ID_KEY, sessionData.sessionId);
  _storage.setValue(USERNAME_KEY, sessionData.username);
};

export const clearSession = (
  _storage: StorageManager,
  clearApiHost: boolean
) => {
  _storage.removeValue(ID_KEY);
  _storage.removeValue(USERNAME_KEY);
  if (clearApiHost) {
    _storage.removeValue(API_HOST_KEY);
  }
};

export const clearCookies = () => {
  deleteCookie("sessionid");
};

export const getConfig = (
  _storage: StorageManager,
  domain?: string
): RequestConfig => {
  const apiHost = _storage.safeGetValue(API_HOST_KEY);
  const sessionId = _storage.safeGetValue(ID_KEY);
  return {
    // THIS IS NOT KOSHER
    apiHost: apiHost ? apiHost : domain ? domain : "",
    sessionId: sessionId ?? "",
  };
};

// Check current session and try to fix it if cookies are not the same as storage
export const sessionValid = (_storage: StorageManager): boolean => {
  const sessionidCookie = getCookie("sessionid");
  const storedSessionId = _storage.safeGetValue(ID_KEY);
  const storedUsername = _storage.safeGetValue(USERNAME_KEY);
  const storedApiHost = _storage.safeGetValue(API_HOST_KEY);

  if (storedSessionId) {
    // Has storage values
    if (sessionidCookie) {
      // Has cookies
      if (sessionidCookie === storedSessionId) {
        // cookies match to storage yes
        return true;
      } else {
        // cookies match to storage no
        return false;
      }
    } else {
      // storage values yes, cookies not needed for fetches, is ok
      return true;
    }
  } else {
    // No storage values but cookies
    if (sessionidCookie) {
      setSession(_storage, {
        sessionId: sessionidCookie,
        username: storedUsername ?? "",
        apiHost: storedApiHost ?? "",
      });
      return true;
    }
    return false;
  }
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
          clearCookies();
        }
  );
  const currentUser = await dapper.getCurrentUser();
  // Only store the currentUser if it's not empty
  if (currentUser.username !== null) {
    storeCurrentUser(_storage, currentUser);
  }
};

export const getSessionCurrentUser = (
  _storage: StorageManager,
  forceUpdateCurrentUser: boolean = false,
  customGetConfig?: (domain?: string) => RequestConfig,
  customClearSession?: () => void
): User | EmptyUser => {
  if (forceUpdateCurrentUser) {
    (async () => {
      await updateCurrentUser(_storage, customGetConfig, customClearSession);
    })();
  }

  let currentUser = _storage.safeGetJsonValue(CURRENT_USER_KEY);
  if (currentUser === null) {
    currentUser = {
      username: null,
      capabilities: [],
      connections: [],
      subscription: {
        expires: null,
      },
      teams: [],
      teams_full: [],
    };
  }
  const parsed = userSchema.safeParse(currentUser);
  if (!parsed.success) {
    const emptyUser = emptyUserSchema.safeParse(currentUser);
    if (!emptyUser.success) {
      throw new Error("Failed to parse empty user");
    }
    return emptyUser.data;
  } else {
    return parsed.data;
  }
};

/**
 * For accessing data API's session id.
 *
 * * isReady: boolean
 * * sessionId?: string
 * * csrfToken?: string
 * * username?: string
 * * setSession: ({sessionId: string, username: string}) => void
 * * clearSession: () => void
 */
export const useSession = (): ContextInterface => {
  const contextState = useContext(SessionContext);

  if (contextState === null) {
    throw new Error("useSession must be used within a SessionProvider tag");
  }

  return contextState;
};

/**
 * Call backend to check if session id found in localStorage is valid.
 *
 * Omits the call if session id is already set in the porovider's
 * internal state.
 */
// const useValidateSession = (
//   _session: SessionData | undefined,
//   _setSession: Dispatch<SetStateAction<SessionData | undefined>>,
//   _storage: StorageManager,
//   apiHost?: string
// ): [
//   /** Is the validation process ready? */
//   boolean,
//   /** Session id if it's valid, otherwise undefined */
//   string | undefined,
//   /** Session id if it's valid, otherwise undefined */
//   string | undefined,
// ] => {
//   const [isValid, setIsValid] = useState<boolean>();
//   const stateSessionId = _session?.sessionId;
//   const stateCsrfToken = _session?.csrfToken;
//   const storedSessionId = _storage.safeGetValue(ID_KEY);
//   const storedCsrfToken = _storage.safeGetValue(CSRF_TOKEN_KEY);

//   useEffect(() => {
//     // Session id stored in SessionProvider's state is always valid, no
//     // need to call backend to check it nor read values from localStorage.
//     if (stateSessionId !== undefined && stateCsrfToken !== undefined) {
//       if (isValid !== true) {
//         setIsValid(true);
//       }
//       return;
//     }

//     // If there's no session id in localStorage, there's nothing to do.
//     if (storedSessionId === null) {
//       if (isValid !== false) {
//         setIsValid(false);
//       }
//       return;
//     }

//     (async () => {
//       const res = await fetch(`${apiHost}/api/experimental/auth/validate/`, {
//         headers: {
//           authorization: `Session ${storedSessionId}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.status === 401) {
//         _storage.removeValue(EMAIL_KEY);
//         _storage.removeValue(ID_KEY);
//         _storage.removeValue(CSRF_TOKEN_KEY);
//         _storage.removeValue(USERNAME_KEY);
//         return;
//       }

//       _setSession({
//         apiHost: apiHost ?? "APIHOST_MISSING",
//         email: _storage.safeGetValue(EMAIL_KEY) || "",
//         sessionId: storedSessionId,
//         csrfToken: storedCsrfToken === null ? undefined : storedCsrfToken,
//         username: _storage.safeGetValue(USERNAME_KEY) || "",
//       });
//       setIsValid(true);
//     })();
//   }, [
//     isValid,
//     setIsValid,
//     stateSessionId,
//     storedSessionId,
//     stateCsrfToken,
//     storedCsrfToken,
//   ]);

//   const isReady = isValid !== undefined;
//   const sessionId = isValid ? storedSessionId || undefined : undefined;
//   const csrfToken = isValid ? storedCsrfToken || undefined : undefined;
//   return [isReady, sessionId, csrfToken];
// };
