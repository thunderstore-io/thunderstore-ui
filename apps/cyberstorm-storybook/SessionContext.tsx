import Router from "next/router";
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
  /** Username from provider's state or localStorage. */
  username?: string;
}

interface LoginResponse {
  email: string;
  sessionId: string;
  username: string;
}

const SessionContext = createContext<ContextInterface | null>(null);
const EMAIL_KEY = "email";
const ID_KEY = "id";
const USERNAME_KEY = "username";

/**
 * For managing data API's session id.
 *
 * This app has two backend: Next.js backend mostly used for SSR, and
 * Django API backend for fetching actual data. The session id for
 * authenticating with the latter is stored in the localStorage, and
 * should be accessed via this convenience provider.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SessionProvider(props: PropsWithChildren) {
  const [_session, _setSession] = useState<LoginResponse>();
  const _storage = new StorageManager("Session");
  const [isReady, sessionId] = useValidateSession(
    _session,
    _setSession,
    _storage
  );

  const setSession = (sessionData: LoginResponse) => {
    _setSession(sessionData);
    _storage.setValue(EMAIL_KEY, sessionData.email);
    _storage.setValue(ID_KEY, sessionData.sessionId);
    _storage.setValue(USERNAME_KEY, sessionData.username);
  };

  const clearSession = () => {
    _setSession(undefined);
    _storage.removeValue(EMAIL_KEY);
    _storage.removeValue(ID_KEY);
    _storage.removeValue(USERNAME_KEY);
  };

  const value = {
    clearSession,
    email: _session?.email,
    isReady,
    sessionId,
    setSession,
    username: _session?.username,
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
  _storage: StorageManager
): [
  /** Is the validation process ready? */
  boolean,
  /** Session id if it's valid, otherwise undefined */
  string | undefined
] => {
  const [isValid, setIsValid] = useState<boolean>();
  const stateSessionId = _session?.sessionId;
  const storedSessionId = _storage.safeGetValue(ID_KEY);

  useEffect(() => {
    // Session id stored in SessionProvider's state is always valid, no
    // need to call backend to check it nor read values from localStorage.
    if (stateSessionId !== undefined) {
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

    (async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_DOMAIN || "https://thunderstore.io"
        }/api/experimental/auth/validate/`,
        {
          headers: {
            authorization: `Session ${storedSessionId}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        _storage.removeValue(EMAIL_KEY);
        _storage.removeValue(ID_KEY);
        _storage.removeValue(USERNAME_KEY);
        Router.push("/");
        return;
      }

      _setSession({
        email: _storage.safeGetValue(EMAIL_KEY) || "",
        sessionId: storedSessionId,
        username: _storage.safeGetValue(USERNAME_KEY) || "",
      });
      setIsValid(true);
    })();
  }, [isValid, setIsValid, stateSessionId, storedSessionId]);

  const isReady = isValid !== undefined;
  const sessionId = isValid ? storedSessionId || undefined : undefined;
  return [isReady, sessionId];
};
