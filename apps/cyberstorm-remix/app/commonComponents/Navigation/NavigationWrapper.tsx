import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";

import { type CurrentUser } from "@thunderstore/dapper/types";

import { MobileNavigationMenu, Navigation } from "./Navigation";

export function NavigationWrapper({
  domain,
  currentUser: loaderCurrentUser,
  communityId,
}: {
  domain: string;
  currentUser: CurrentUser | undefined;
  communityId?: string;
}) {
  // Global 404s skip the root loader, so Layout cannot supply currentUser.
  const rootLoaderDataAvailable = useRouteLoaderData("root") !== undefined;

  const [sessionCurrentUser, setSessionCurrentUser] = useState<
    CurrentUser | undefined
  >();

  useEffect(() => {
    if (rootLoaderDataAvailable) {
      return;
    }

    let active = true;

    async function loadSessionUser() {
      try {
        const publicEnvVariables = getPublicEnvVariables([
          "VITE_API_URL",
          "VITE_COOKIE_DOMAIN",
        ]);
        if (
          !publicEnvVariables.VITE_API_URL ||
          !publicEnvVariables.VITE_COOKIE_DOMAIN
        ) {
          return;
        }

        const tools = getSessionTools();
        tools.runSessionValidationCheck(
          publicEnvVariables.VITE_API_URL,
          publicEnvVariables.VITE_COOKIE_DOMAIN
        );
        const currentUser = await tools.getSessionCurrentUser();
        if (!active) {
          return;
        }
        setSessionCurrentUser(currentUser.username ? currentUser : undefined);
      } catch (error) {
        if (!active) {
          return;
        }
        console.error("Failed to get current user from session:", error);
        setSessionCurrentUser(undefined);
      }
    }

    loadSessionUser();

    return () => {
      active = false;
    };
  }, [rootLoaderDataAvailable]);

  const currentUser = rootLoaderDataAvailable
    ? loaderCurrentUser
    : sessionCurrentUser;

  return (
    <>
      <Navigation
        currentUser={currentUser}
        domain={domain}
        communityId={communityId}
      />
      <MobileNavigationMenu domain={domain} currentUser={currentUser} />
    </>
  );
}
