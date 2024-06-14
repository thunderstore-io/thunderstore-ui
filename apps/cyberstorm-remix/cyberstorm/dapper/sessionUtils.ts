import { DapperTs } from "@thunderstore/dapper-ts";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export async function getDapper(isClient = false) {
  if (isClient) {
    const dapper = window.Dapper;

    let shouldRemakeDapper = false;
    const newConfig: RequestConfig = {
      apiHost: window.ENV.PUBLIC_API_URL,
      sessionId: undefined,
      csrfToken: undefined,
    };

    if (dapper) {
      // REMIX TODO: Security issues?
      // API url has changed
      // if (dapper.config.apiHost !== window.ENV.PUBLIC_API_URL) {
      //   newConfig.apiHost = window.ENV.PUBLIC_API_URL;
      //   shouldRemakeDapper = true;
      // }

      const allCookies = new URLSearchParams(
        window.document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
      );
      const cookie = allCookies.get("sessionid");
      const csrftoken = allCookies.get("csrftoken");

      // sessionId is old
      if (
        dapper.config.sessionId &&
        typeof cookie === "string" &&
        dapper.config.sessionId !== cookie
      ) {
        newConfig.sessionId = cookie;
        shouldRemakeDapper = true;
      }

      // sessionId is not set and cookie exists
      if (!dapper.config.sessionId && typeof cookie === "string") {
        newConfig.sessionId = cookie;
        shouldRemakeDapper = true;
      }

      // csrfToken is old
      if (
        dapper.config.csrfToken &&
        typeof csrftoken === "string" &&
        dapper.config.csrfToken !== csrftoken
      ) {
        newConfig.csrfToken = csrftoken;
        shouldRemakeDapper = true;
      }

      // csrfToken is not set and cookie exists
      if (!dapper.config.csrfToken && typeof csrftoken === "string") {
        newConfig.csrfToken = csrftoken;
        shouldRemakeDapper = true;
      }
    } else {
      shouldRemakeDapper = true;
    }

    const createNewDapper = () => {
      const newDapper = new DapperTs(newConfig);
      window.Dapper = newDapper;
      return newDapper;
    };

    // Dapper should exist at this point, but we are ensuring it for type safety and idiot me safety
    const existingDapper = shouldRemakeDapper
      ? createNewDapper()
      : dapper
      ? dapper
      : new DapperTs(newConfig);

    return existingDapper;
  } else {
    return new DapperTs({
      apiHost: process.env.PUBLIC_API_URL,
      sessionId: undefined,
      csrfToken: undefined,
    });
  }
}
