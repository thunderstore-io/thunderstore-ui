/**
 * Whether a navigation stays inside the same community, so the `/c/*` layout
 * route can skip refetching data that cannot have changed.
 *
 * Compares the route param rather than a path segment. `/c/a/` and `/c/b/`
 * share their first segment ("c"), so comparing that reports every `/c/*`
 * navigation as the same community and leaves one community's name, icon and
 * hero rendered on another community's page. The API resolves ids
 * case-insensitively (its endpoints lowercase them), so they are compared the
 * same way here — `/c/Foo/` and `/c/foo/` are one community, not two.
 */
export function isSameCommunity(
  currentParams: { communityId?: string },
  nextParams: { communityId?: string }
): boolean {
  const current = currentParams.communityId?.toLowerCase();
  return (
    current !== undefined && current === nextParams.communityId?.toLowerCase()
  );
}
