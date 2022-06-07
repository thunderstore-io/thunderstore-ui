import Router from "next/router";
import { useEffect, useState } from "react";

import { useSession } from "components/SessionContext";
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
  const { setSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    (async () => {
      OAuthManager.validateStateSecret(provider, receivedState);
      setIsLoading(true);
      const res = await postNextBackend(provider, code);

      if (res.ok) {
        const { ok, ...payload } = res;
        setSession(payload);
        Router.push("/");
      } else {
        throw new Error(`AuthError: ${res.error}`);
      }
    })();
  }, [code, isLoading, provider, receivedState, setIsLoading, setSession]);
};

const postNextBackend = async (
  provider: Provider,
  code: string
): Promise<AuthCompleteResponse> => {
  const requestSettings = getJsonPostSettings({ code, provider });
  const res = await fetch("/api/auth/complete", requestSettings);
  return await res.json();
};
