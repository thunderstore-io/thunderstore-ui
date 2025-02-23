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
    const cu = session.getSessionCurrentUser();
    if (cu.username) {
      setCurrentUser(session.getSessionCurrentUser());
    } else {
      setCurrentUser(undefined);
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
