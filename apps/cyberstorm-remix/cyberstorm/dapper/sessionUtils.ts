/* eslint-disable prettier/prettier */
import { redirect } from "@remix-run/react";
import { DapperTs } from "@thunderstore/dapper-ts";
import { emptyUser } from "@thunderstore/dapper-ts/src/methods/currentUser";
import { CurrentUser } from "@thunderstore/dapper/types";
import { useSession } from "@thunderstore/ts-api-react";
import { createContext } from "react";

export function getDapper(isClient = false) {
  if (isClient) {
    const session = useSession();
    // TODO: Add "ValidateDapper" and stop always returning a new dapper.
    return new DapperTs(session.getConfig(), () => {
      session.clearSession();
      redirect("/communities");
    });
  } else {
    return new DapperTs({
      apiHost: process.env.PUBLIC_API_URL,
      sessionId: undefined,
      csrfToken: undefined,
    });
  }
}

export const CurrentUserContext = createContext<CurrentUser>(emptyUser);
export const CurrentUserProvider = CurrentUserContext.Provider;
