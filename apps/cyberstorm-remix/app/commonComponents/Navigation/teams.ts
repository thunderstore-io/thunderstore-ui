// Team-list helpers for the nav's Teams menus. Kept out of Navigation.tsx so
// they can be unit tested without pulling in the whole navigation tree.

/**
 * Case-insensitive alphabetical sort of the current user's team names. The API
 * returns them in an arbitrary order. Non-mutating: the caller's array (which
 * comes straight off the loader data) is left alone.
 */
export function sortTeams(teams: string[]): string[] {
  return [...teams].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

/**
 * Case-insensitive substring filter. An empty or whitespace-only query matches
 * everything, so clearing the box restores the full list.
 */
export function filterTeams(teams: string[], query: string): string[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return teams;
  return teams.filter((team) => team.toLowerCase().includes(needle));
}

// Above this many teams the desktop dropdown shows a filter box; below it the
// list is short enough to scan.
export const TEAMS_FILTER_THRESHOLD = 8;
