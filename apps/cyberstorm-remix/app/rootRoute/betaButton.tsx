// Temporary solution for adding the beta button

import { useEffect, useRef } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

// REMIX TODO: Move to dynamic html
export function BetaButtonInit() {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);
  const hasRun = useRef(false);

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if ((!startsHydrated.current && isHydrated) || hasRun.current) return;
    if (typeof window !== "undefined") {
      const $script = document.createElement("script");
      $script.src = "/cyberstorm-static/scripts/beta-switch.js";
      $script.setAttribute("async", "true");

      document.body.append($script);
      hasRun.current = true;

      return () => $script.remove();
    }
  }, []);

  return <></>;
}
