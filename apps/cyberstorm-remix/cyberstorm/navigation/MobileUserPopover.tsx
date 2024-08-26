import { useEffect, useState } from "react";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { emptyUser } from "@thunderstore/dapper-ts/src/methods/currentUser";
import { CurrentUser } from "@thunderstore/dapper/types";
import { MobileUserPopoverContent } from "./MobileUserPopoverContent";

export function MobileUserPopover() {
  const [user, setUser] = useState<CurrentUser>(emptyUser);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const dapper = await getDapper(true);
      const fetchedUser = await dapper.getCurrentUser();
      setUser(fetchedUser);
    };
    fetchAndSetUser();
  }, []);

  return <MobileUserPopoverContent user={user} />;
}
