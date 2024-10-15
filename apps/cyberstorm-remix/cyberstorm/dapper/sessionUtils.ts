import { redirect } from "@remix-run/react";
import { DapperTs } from "@thunderstore/dapper-ts";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export async function getDapper(isClient = false) {
  if (isClient) {
    const getCookie = (cookieName: string) =>
      new RegExp(`${cookieName}=([^;]+);`).exec(document.cookie)?.[1];
    const deleteCookie = (name: string) => {
      const date = new Date();
      date.setTime(0);
      document.cookie = `${name}=${null}; expires=${date.toUTCString()}; path=/`;
    };

    const removeSession = () => {
      deleteCookie("sessionid");
      deleteCookie("csrftoken");
      redirect("/communities");
    };
    const dapper = window.Dapper;

    let shouldRemakeDapper = false;

    const cookie = getCookie("sessionid");
    const csrftoken = getCookie("csrftoken");

    const newConfig: RequestConfig = {
      apiHost: window.ENV.PUBLIC_API_URL,
      sessionId: cookie ?? undefined,
      csrfToken: csrftoken ?? undefined,
    };

    if (dapper) {
      // REMIX TODO: Security issues?
      // API url has changed
      // if (dapper.config.apiHost !== window.ENV.PUBLIC_API_URL) {
      //   newConfig.apiHost = window.ENV.PUBLIC_API_URL;
      //   shouldRemakeDapper = true;
      // }

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
      const newDapper = new DapperTs(newConfig, removeSession);
      window.Dapper = newDapper;
      return newDapper;
    };

    // Dapper should exist at this point, but we are ensuring it for type safety and idiot me safety
    const existingDapper = shouldRemakeDapper
      ? createNewDapper()
      : dapper
        ? dapper
        : new DapperTs(newConfig, removeSession);

    return existingDapper;
  } else {
    return new DapperTs({
      apiHost: process.env.PUBLIC_API_URL,
      sessionId: undefined,
      csrfToken: undefined,
    });
  }
}
