import {
  ContextInterface,
  getSessionContext,
} from "@thunderstore/ts-api-react/src/SessionContext";
import {
  unstable_createContext,
  unstable_RouterContextProvider,
} from "react-router";

// MIDDLEWARES START
const sessionContext = unstable_createContext<ContextInterface>(
  getSessionContext(import.meta.env.VITE_API_URL)
);

// @ts-expect-error No good typing for middleware context yet
export const sessionClientMiddleware = async ({ context }) => {
  const session = getSessionContext(import.meta.env.VITE_API_URL);

  context.set(sessionContext, session);
};

export function getSessionTools(context: unstable_RouterContextProvider) {
  return context.get(sessionContext);
}

// export const unstable_middleware = [sessionMiddleware];
// export const unstable_clientMiddleware = [sessionClientMiddleware];

// MIDDLEWARES END
