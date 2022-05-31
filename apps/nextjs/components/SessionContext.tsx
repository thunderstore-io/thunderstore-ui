import { createContext, FC, useContext, useState } from "react";

import { StorageManager } from "utils/storage";

interface ContextInterface {
  /** Remove sessionId from provider's state and localStorage. */
  clearSessionId: () => void;
  /** Fetch sessionId from provider's state or localStorage. */
  sessionId?: string;
  /** Store sessionId in provider's state and localStorage. */
  setSessionId: (sessionId?: string) => void;
}

const SessionContext = createContext<ContextInterface | null>(null);
const ID_KEY = "id";

/**
 * For managing data API's session id.
 *
 * This app has two backend: Next.js backend mostly used for SSR, and
 * Django API backend for fetching actual data. The session id for
 * authenticating with the latter is stored in the localStorage, and
 * should be accessed via this convenience provider.
 */
export const SessionProvider: FC = (props) => {
  const [_sessionId, _setSessionId] = useState<string>();
  const _storage = new StorageManager("Session");

  if (_sessionId === undefined) {
    const storedId = _storage.safeGetValue(ID_KEY);

    if (storedId) {
      _setSessionId(storedId);
    }
  }

  const setSessionId = (sessionId?: string) => {
    _setSessionId(sessionId);

    if (sessionId) {
      _storage.setValue(ID_KEY, sessionId);
    } else {
      _storage.removeValue(ID_KEY);
    }
  };

  const clearSessionId = () => {
    _setSessionId(undefined);
    _storage.removeValue(ID_KEY);
  };

  const value = {
    clearSessionId,
    sessionId: _sessionId,
    setSessionId,
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
 * * setSessionId: (sessionId: string) => void
 * * clearSessionId: () => void
 */
export const useSession = (): ContextInterface => {
  const contextState = useContext(SessionContext);

  if (contextState === null) {
    throw new Error("useSession must be used within a SessionProvider tag");
  }

  return contextState;
};
