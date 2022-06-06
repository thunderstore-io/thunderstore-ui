import { createContext, FC, useContext, useState } from "react";

import { StorageManager } from "utils/storage";

interface ContextInterface {
  /** Fetch user email from provider's state or localStorage. */
  email?: string;
  /** Remove session data from provider's state and localStorage. */
  clearSession: () => void;
  /** Fetch sessionId from provider's state or localStorage. */
  sessionId?: string;
  /** Store session data in provider's state and localStorage. */
  setSession: (sessionData: LoginResponse) => void;
  /** Fetch username from provider's state or localStorage. */
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
export const SessionProvider: FC = (props) => {
  const [_session, _setSession] = useState<LoginResponse>();
  const _storage = new StorageManager("Session");

  if (_session?.sessionId === undefined) {
    const storedEmail = _storage.safeGetValue(EMAIL_KEY);
    const storedId = _storage.safeGetValue(ID_KEY);
    const storedUsername = _storage.safeGetValue(USERNAME_KEY);

    if (storedId) {
      _setSession({
        email: storedEmail || "",
        sessionId: storedId,
        username: storedUsername || "",
      });
    }
  }

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
    sessionId: _session?.sessionId,
    setSession,
    username: _session?.username,
  };

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};

/**
 * For accessing data API's session id.
 *
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
