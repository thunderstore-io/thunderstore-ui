"use client";
import {
  createContext,
  // Dispatch,
  PropsWithChildren,
  // SetStateAction,
  useContext,
  useEffect,
  // useState,
} from "react";

import { StorageManager } from "./storage";
import { RequestConfig } from "@thunderstore/thunderstore-api";
// Probably shouldn't from Dapper, but what can you do when you need these.
import { CurrentUser } from "@thunderstore/dapper/types";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  currentUserSchema,
  emptyUser,
} from "@thunderstore/dapper-ts/src/methods/currentUser";

interface ContextInterface {
  /** Remove session data from provider's state and localStorage. */
  clearSession: () => void;
  /** Remove session cookies. */
  clearCookies: () => void;
  /** Get RequestConfig for Dapper usage */
  getConfig: () => RequestConfig;
  /** Check if session is valid and try to repair if not */
  sessionValid: () => boolean;
  /** apiHost of the session */
  apiHost?: string;
  /** Async function to update currentUser */
  updateCurrentUser: () => Promise<void>;
  /** Function to get the currentUser */
  getSessionCurrentUser: (forceUpdateCurrentUser?: boolean) => CurrentUser;
}

interface SessionData {
  apiHost: string;
  sessionId: string;
  username: string;
  csrfToken?: string;
}

const SessionContext = createContext<ContextInterface | null>(null);
const ID_KEY = "id";
const CSRF_TOKEN_KEY = "csrftoken";
const USERNAME_KEY = "username";
const API_HOST_KEY = "apiHost";

// CurrentUser objects keys
const CURRENT_USER_KEY = "currentUser";

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

  useEffect(() => {
    const sessionidCookie = getCookie("sessionid");
    const csrftokenCookie = getCookie("csrftoken");

    if (sessionidCookie && csrftokenCookie) {
      setSession({
        sessionId: sessionidCookie,
        csrfToken: csrftokenCookie,
        username: "",
        apiHost: props.apiHost,
      });
    } else {
      _storage.setValue(API_HOST_KEY, props.apiHost);
      sessionValid();
    }
  }, []);

  const setSession = (sessionData: SessionData) => {
    _storage.setValue(API_HOST_KEY, sessionData.apiHost);
    _storage.setValue(ID_KEY, sessionData.sessionId);
    if (sessionData.csrfToken) {
      _storage.setValue(CSRF_TOKEN_KEY, sessionData.csrfToken);
    }
    _storage.setValue(USERNAME_KEY, sessionData.username);
  };

  const clearSession = () => {
    _storage.removeValue(ID_KEY);
    _storage.removeValue(CSRF_TOKEN_KEY);
    _storage.removeValue(USERNAME_KEY);
    _storage.removeValue(API_HOST_KEY);
  };

  const clearCookies = () => {
    deleteCookie("sessionid");
    deleteCookie("csrftoken");
  };

  const getConfig = (): RequestConfig => {
    const apiHost = _storage.safeGetValue(API_HOST_KEY);
    const sessionId = _storage.safeGetValue(ID_KEY);
    const csrfToken = _storage.safeGetValue(CSRF_TOKEN_KEY);
    return {
      // THIS IS NOT KOSHER
      apiHost: apiHost ?? "",
      sessionId: sessionId ?? "",
      csrfToken: csrfToken ?? "",
    };
  };

  // Check current session and try to fix it if cookies are not the same as storage
  const sessionValid = (): boolean => {
    const sessionidCookie = getCookie("sessionid");
    const csrftokenCookie = getCookie("csrftoken");
    const storedSessionId = _storage.safeGetValue(ID_KEY);
    const storedCsrfToken = _storage.safeGetValue(CSRF_TOKEN_KEY);
    const storedUsername = _storage.safeGetValue(USERNAME_KEY);
    const storedApiHost = _storage.safeGetValue(API_HOST_KEY);

    if (storedSessionId && storedCsrfToken) {
      // Has storage values
      if (sessionidCookie && csrftokenCookie) {
        // Has cookies
        if (
          sessionidCookie === storedSessionId &&
          csrftokenCookie === storedCsrfToken
        ) {
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
      if (sessionidCookie && csrftokenCookie) {
        setSession({
          sessionId: sessionidCookie,
          csrfToken: csrftokenCookie,
          username: storedUsername ?? "",
          apiHost: storedApiHost ?? "",
        });
        return true;
      }
      return false;
    }
  };

  const storeCurrentUser = (currentUser: CurrentUser) => {
    _storage.setJsonValue(CURRENT_USER_KEY, currentUser);
  };

  const updateCurrentUser = async () => {
    const dapper = new DapperTs(getConfig(), clearSession);
    const currentUser = await dapper.getCurrentUser();
    storeCurrentUser(currentUser);
  };

  const getSessionCurrentUser = (
    forceUpdateCurrentUser: boolean = false
  ): CurrentUser => {
    if (forceUpdateCurrentUser) {
      (async () => {
        await updateCurrentUser();
      })();
    }

    const currentUser = _storage.safeGetJsonValue(CURRENT_USER_KEY);
    const parsed = currentUserSchema.safeParse(currentUser);
    if (!parsed.success) {
      return emptyUser;
    } else {
      return currentUser;
    }
  };

  const value = {
    clearSession,
    clearCookies,
    getConfig,
    sessionValid,
    updateCurrentUser,
    getSessionCurrentUser,
    setSession,
    apiHost: props.apiHost,
  };

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}

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
