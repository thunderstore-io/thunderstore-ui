import Router from "next/router";
import { useEffect } from "react";

import { AuthCompleteResponse } from "pages/api/auth/complete";
import { getJsonPostSettings } from "utils/fetch";
import { OAuthManager, Provider } from "utils/oauth";

/**
 * Complete OAuth authentication flow and redirect user to frontpage.
 */
export const useCompleteLogin = (
  provider: Provider,
  code: string,
  receivedState: string
): void => {
  OAuthManager.validateStateSecret(provider, receivedState);

  useEffect(() => {
    (async () => {
      const res = await postNextBackend(provider, code);

      if (!res.ok) {
        throw new Error(`AuthError: ${res.error}`);
      }

      // TODO: store res.sessionId to global state.
      Router.push("/");
    })();
  }, [code, provider]);
};

const postNextBackend = async (
  provider: Provider,
  code: string
): Promise<AuthCompleteResponse> => {
  const requestSettings = getJsonPostSettings({ code, provider });
  const res = await fetch("/api/auth/complete", requestSettings);
  return await res.json();
};
