"use client";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { StorageManager } from "./storage";

interface ContextInterface {
  /** User email from provider's state or localStorage. */
  email?: string;
  /** Remove session data from provider's state and localStorage. */
  clearSession: () => void;
  /** False while session id from localStorage is being validated */
  isReady: boolean;
  /** Session id from provider's state or localStorage. */
  sessionId?: string;
  /** Store session data in provider's state and localStorage. */
  setSession: (sessionData: LoginResponse) => void;
  /** Session id from provider's state or localStorage. */
  csrfToken?: string;
  /** Username from provider's state or localStorage. */
  username?: string;
  /** Domain of the session */
  domain?: string;
}

interface LoginResponse {
  email: string;
  sessionId: string;
  username: string;
  csrfToken?: string;
}

const SessionContext = createContext<ContextInterface | null>(null);
const EMAIL_KEY = "email";
const ID_KEY = "id";
const CSRF_TOKEN = "csrftoken";
const USERNAME_KEY = "username";

interface Props extends PropsWithChildren {
  domain?: string;
}

/**
 * For managing data API's session id.
 *
 * This app has two backend: Next.js backend mostly used for SSR, and
 * Django API backend for fetching actual data. The session id for
 * authenticating with the latter is stored in the localStorage, and
 * should be accessed via this convenience provider.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SessionProvider(props: Props) {
  const [_session, _setSession] = useState<LoginResponse>();
  const _storage = new StorageManager("Session");

  useEffect(() => {
    // Check if the browser has a Django "sessionid" cookie
    // Same code is repeated inside useValidateSession
    // TODO: There's something weird going on, because the first load
    // of the page after login, doesn't grab the sessionid
    if (_storage.safeGetValue(ID_KEY) === null) {
      const sessionid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionid="))
        ?.split("=")[1];
      if (sessionid) {
        _storage.setValue(ID_KEY, sessionid);
      }
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      if (csrftoken) {
        _storage.setValue(CSRF_TOKEN, csrftoken);
      }
    }
  }, []);

  const [isReady, sessionId, csrfToken] = useValidateSession(
    _session,
    _setSession,
    _storage,
    props.domain
  );

  const setSession = (sessionData: LoginResponse) => {
    _setSession(sessionData);
    _storage.setValue(EMAIL_KEY, sessionData.email);
    _storage.setValue(ID_KEY, sessionData.sessionId);
    if (sessionData.csrfToken) {
      _storage.setValue(CSRF_TOKEN, sessionData.csrfToken);
    }
    _storage.setValue(USERNAME_KEY, sessionData.username);
  };

  const clearSession = () => {
    _setSession(undefined);
    _storage.removeValue(EMAIL_KEY);
    _storage.removeValue(ID_KEY);
    _storage.removeValue(CSRF_TOKEN);
    _storage.removeValue(USERNAME_KEY);
  };

  const value = {
    clearSession,
    email: _session?.email,
    isReady,
    sessionId,
    csrfToken,
    setSession,
    username: _session?.username,
    domain: props.domain,
  };

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}

/**
 * For accessing data API's session id.
 *
 * * isReady: boolean
 * * sessionId?: string
 * * csrfToken?: string
 * * username?: string
 * * email?: string
 * * setSession: ({email: string, sessionId: string, username: string}) => void
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
const useValidateSession = (
  _session: LoginResponse | undefined,
  _setSession: Dispatch<SetStateAction<LoginResponse | undefined>>,
  _storage: StorageManager,
  domain?: string
): [
  /** Is the validation process ready? */
  boolean,
  /** Session id if it's valid, otherwise undefined */
  string | undefined,
  /** Session id if it's valid, otherwise undefined */
  string | undefined
] => {
  const [isValid, setIsValid] = useState<boolean>();
  const stateSessionId = _session?.sessionId;
  const stateCsrfToken = _session?.csrfToken;
  const storedSessionId = _storage.safeGetValue(ID_KEY);
  const storedCsrfToken = _storage.safeGetValue(CSRF_TOKEN);

  useEffect(() => {
    // Session id stored in SessionProvider's state is always valid, no
    // need to call backend to check it nor read values from localStorage.
    if (stateSessionId !== undefined && stateCsrfToken !== undefined) {
      if (isValid !== true) {
        setIsValid(true);
      }
      return;
    }

    // If there's no session id in localStorage, there's nothing to do.
    if (storedSessionId === null) {
      if (isValid !== false) {
        setIsValid(false);
      }
      return;
    }

    const deleteCookie = (name: string) => {
      const date = new Date();
      date.setTime(0);
      document.cookie = `${name}=${null}; expires=${date.toUTCString()}; path=/`;
    };

    (async () => {
      const res = await fetch(`${domain}/api/experimental/auth/validate/`, {
        headers: {
          authorization: `Session ${storedSessionId}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        _storage.removeValue(EMAIL_KEY);
        _storage.removeValue(ID_KEY);
        _storage.removeValue(CSRF_TOKEN);
        _storage.removeValue(USERNAME_KEY);
        deleteCookie("sessionid");
        deleteCookie("csrftoken");
        // Router.push("/");
        return;
      }

      _setSession({
        email: _storage.safeGetValue(EMAIL_KEY) || "",
        sessionId: storedSessionId,
        csrfToken: storedCsrfToken === null ? undefined : storedCsrfToken,
        username: _storage.safeGetValue(USERNAME_KEY) || "",
      });
      setIsValid(true);
    })();
  }, [
    isValid,
    setIsValid,
    stateSessionId,
    storedSessionId,
    stateCsrfToken,
    storedCsrfToken,
  ]);

  const isReady = isValid !== undefined;
  const sessionId = isValid ? storedSessionId || undefined : undefined;
  const csrfToken = isValid ? storedCsrfToken || undefined : undefined;
  return [isReady, sessionId, csrfToken];
};
