import { describe, expect, test } from "vitest";

import { TEAMS_FILTER_THRESHOLD, filterTeams, sortTeams } from "../teams";

describe("sortTeams", () => {
  test("sorts case-insensitively", () => {
    // The pre-sort bug this replaced: a plain sort() puts every capitalised
    // name ahead of every lowercase one, so "zebra" sorted before "apple".
    expect(sortTeams(["zebra", "Apple", "mango", "Banana"])).toEqual([
      "Apple",
      "Banana",
      "mango",
      "zebra",
    ]);
  });

  test("does not mutate the input", () => {
    // `teams` comes straight off the loader data, which is shared.
    const input = ["c", "a", "b"];
    sortTeams(input);
    expect(input).toEqual(["c", "a", "b"]);
  });

  test("handles duplicates and empty input", () => {
    expect(sortTeams([])).toEqual([]);
    expect(sortTeams(["a", "A", "a"])).toHaveLength(3);
  });
});

describe("filterTeams", () => {
  const teams = ["Alpha_Crew", "beta_squad", "Gamma_Guild", "delta"];

  test("matches case-insensitively on a substring", () => {
    expect(filterTeams(teams, "squad")).toEqual(["beta_squad"]);
    expect(filterTeams(teams, "ALPHA")).toEqual(["Alpha_Crew"]);
    expect(filterTeams(teams, "_")).toEqual([
      "Alpha_Crew",
      "beta_squad",
      "Gamma_Guild",
    ]);
  });

  test("returns everything for an empty or whitespace query", () => {
    // Clearing the box has to restore the full list, not empty it.
    expect(filterTeams(teams, "")).toEqual(teams);
    expect(filterTeams(teams, "   ")).toEqual(teams);
  });

  test("ignores surrounding whitespace in the query", () => {
    expect(filterTeams(teams, "  delta  ")).toEqual(["delta"]);
  });

  test("returns an empty list when nothing matches", () => {
    expect(filterTeams(teams, "nope")).toEqual([]);
  });

  test("preserves the order it was given", () => {
    // The submenu sorts first and filters second, so filtering must not
    // reorder or the list would jump around as the user types.
    expect(filterTeams(sortTeams(teams), "a")).toEqual([
      "Alpha_Crew",
      "beta_squad",
      "delta",
      "Gamma_Guild",
    ]);
  });
});

describe("TEAMS_FILTER_THRESHOLD", () => {
  test("is small enough that the filter appears before the list needs scrolling", () => {
    // The dropdown caps at 24rem (~384px) and items are ~22px, so roughly 14
    // fit. The filter must show up before the user has to scroll blind.
    expect(TEAMS_FILTER_THRESHOLD).toBeGreaterThan(0);
    expect(TEAMS_FILTER_THRESHOLD).toBeLessThan(14);
  });
});
