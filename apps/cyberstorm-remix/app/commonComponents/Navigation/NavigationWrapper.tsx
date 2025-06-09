import { useSession } from "@thunderstore/ts-api-react";
import { useHydrated } from "remix-utils/use-hydrated";
import { useEffect, useRef, useState } from "react";

import { CurrentUser } from "@thunderstore/dapper/types";
import {
  MobileNavigationMenu,
  MobileUserPopoverContent,
  Navigation,
} from "./Navigation";

export function NavigationWrapper({ domain }: { domain: string }) {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // We have to do this CurrentUser thing manually, because we dont' have access to useOutletContext in the Navigation.
  // As it's deep enough in the tree.
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const session = useSession();
  useEffect(() => {
    let cu: CurrentUser | undefined = undefined;
    // TODO: Fix this issue in a lasting way.
    // IMPORTANT: If this try catch is removed and for whatever
    // reason the retrieval of current user fails, the throws from
    // inside the useEffect will cause the whole navigation and the
    // navigationwrapper to rerender. Which then becomes a infinite
    // loop of trying to parse the currentUser stored in the storage.
    try {
      cu = session.getSessionCurrentUser();
      if (cu.username) {
        setCurrentUser(cu);
      } else {
        setCurrentUser(undefined);
      }
    } catch (e) {
      // If we can't get the current user, we just set it to undefined.
      console.error("Failed to get current user from session:", e);
    }
  }, []);

  return (
    <>
      <Navigation
        hydrationCheck={!startsHydrated.current && isHydrated}
        currentUser={currentUser}
        domain={domain}
      />
      <MobileNavigationMenu domain={domain} />
      {!startsHydrated.current && isHydrated && currentUser ? (
        <MobileUserPopoverContent user={currentUser} domain={domain} />
      ) : (
        <MobileUserPopoverContent />
      )}
    </>
  );
}
