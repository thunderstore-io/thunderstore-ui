import semverCompare from "semver/functions/compare";

import {
  type TableCompareColumnMeta,
  type NewTableRow as TableRow,
} from "@thunderstore/cyberstorm";

import { isSemver } from "./typeChecks";

/**
 * Ascending semantic-version compare (`1.9.0` before `1.10.0`).
 * Values that are not semver compare equal, so callers can leave them in place.
 */
export function compareVersionNumbers(a: string, b: string): number {
  if (isSemver(a) && isSemver(b)) {
    return semverCompare(a, b);
  }

  return 0;
}

/** Newest semantic version first. Does not mutate `versions`. */
export function sortVersionNumbersDescending(
  versions: readonly string[]
): string[] {
  return [...versions].sort((a, b) => compareVersionNumbers(b, a));
}

export function rowSemverCompare(
  a: TableRow,
  b: TableRow,
  columnMeta: TableCompareColumnMeta
) {
  const av = String(a[0].sortValue);
  const bv = String(b[0].sortValue);

  return compareVersionNumbers(av, bv) * columnMeta.direction;
}
