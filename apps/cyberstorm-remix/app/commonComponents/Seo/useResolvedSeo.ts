import {
  type SeoReturn,
  type SeoValue,
  collectMatchSeo,
  findMatchWithSeoInMatches,
  isSeoReturn,
} from "cyberstorm/utils/meta";
import { useEffect, useRef, useState } from "react";
import type { UIMatch } from "react-router";

/** What a promise settled to, and which promise it was, so the descriptors are
 *  dropped as soon as the route starts fetching something else. */
type SettledSeo = {
  source: SeoValue;
  seo: SeoReturn;
};

/**
 * The merged seo of the matched routes, with the descriptors of any route that
 * handed over a promise folded in as it settles. That is what lets a route
 * stream the data its tags describe: the title and canonical follow the data
 * instead of the navigation waiting on them.
 *
 * Only the promise currently in the route's data counts. A route that revalidates
 * gets a new promise and contributes nothing until it settles, so switching
 * communities shows the site title for a moment rather than the community that
 * was open before. A route that does not revalidate keeps the same promise, and
 * with it the tags it already resolved, so navigating inside a community does
 * not flicker.
 *
 * None of this runs on the server: an SSR loader resolves its own data before
 * returning, so the server renders the finished tags either way.
 */
export function useResolvedSeo(
  matches: UIMatch<unknown, unknown>[]
): SeoReturn | undefined {
  const [settled, setSettled] = useState<Record<string, SettledSeo>>({});
  // Subscribe to each promise once, keyed by the promise itself so a route that
  // revalidates is subscribed again for its new one.
  const subscribed = useRef(new WeakSet<object>());
  // How many promises a route has handed over so far. Promises do not settle in
  // the order they were made: a slow one from the community you left can land
  // after the fast one for the community you are on, and writing it would hand
  // the route tags it has already moved past — which the source check below
  // then drops, leaving the route with none at all, because the WeakSet means
  // the current promise is never subscribed again.
  const generation = useRef<Record<string, number>>({});
  const matchSeo = collectMatchSeo(matches);

  // No dependency list: a navigation can bring a new promise on any render, and
  // the WeakSet makes a repeat pass a no-op.
  useEffect(() => {
    for (const { id, value } of matchSeo) {
      if (isSeoReturn(value) || subscribed.current.has(value)) {
        continue;
      }
      subscribed.current.add(value);
      const current = (generation.current[id] ?? 0) + 1;
      generation.current[id] = current;
      value.then(
        (resolved) => {
          if (generation.current[id] !== current) {
            return;
          }
          if (isSeoReturn(resolved)) {
            setSettled((previous) => ({
              ...previous,
              [id]: { source: value, seo: resolved },
            }));
          }
        },
        // Belt and braces: a promised seo is expected to resolve to undefined
        // on failure, and an unhandled rejection here would only be noise.
        () => undefined
      );
    }
  });

  const resolved: Record<string, SeoReturn> = {};
  for (const { id, value } of matchSeo) {
    if (settled[id]?.source === value) {
      resolved[id] = settled[id].seo;
    }
  }

  return findMatchWithSeoInMatches(matches, resolved);
}
