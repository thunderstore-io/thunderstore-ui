import { useEffect, useState } from "react";

/***
 * Return true if given media query string evaluates to true.
 *
 * Note: the initial server-side rendering will always return false.
 * After that the variable is updated by event listeners on server-side.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matchesQuery, setMatchesQuery] = useState(false);
  const checkMatch = () => setMatchesQuery(window.matchMedia(query).matches);

  useEffect(() => {
    // Set initial state, which will always be false for the initial,
    // server-side rendering.
    checkMatch();

    // Update the state whenever the component is (re)rendered in browser.
    window.addEventListener("resize", checkMatch);
    return () => window.removeEventListener("resize", checkMatch);
  }, [checkMatch]);

  return matchesQuery;
};
