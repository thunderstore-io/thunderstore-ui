import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useSession } from "components/SessionContext";

/**
 * Refresh page contents from data API if user is authenticated.
 *
 * The session id used to authenticate the user for the data API is
 * stored in the localStorage and thus isn't available when Next.js
 * renders the initial page on the server-side. This hook can be used to
 * refetch the data on the client-side in case the user is
 * authenticated.
 *
 * Note: to avoid unnecessary requests, this should be used only on
 * pages where the contents can actually differ between an authenticated
 * and unauthenticated user.
 *
 * @param setProps method for storing response contents in React state
 * @param dapperMethod data fetching method provided by Dapper
 * @param dapperParams array of parameters passed to dapperMethod
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFreshProps<T extends (...args: any) => any>(
  setProps: Dispatch<SetStateAction<Awaited<ReturnType<T>>>>,
  dapperMethod: T,
  dapperParams: Parameters<T>
): void {
  const { sessionId } = useSession();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun || sessionId === undefined) {
      return;
    }

    const fetchData = async () => {
      const props = await dapperMethod(...dapperParams);
      setProps(props);
    };

    fetchData();
    setHasRun(true);
  }, [dapperMethod, dapperParams, hasRun, sessionId, setHasRun, setProps]);
}
