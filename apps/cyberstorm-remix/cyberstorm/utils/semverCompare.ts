import semverCompare from "semver/functions/compare";

import {
  type TableCompareColumnMeta,
  type NewTableRow as TableRow,
} from "@thunderstore/cyberstorm";

import { isSemver } from "./typeChecks";

export function rowSemverCompare(
  a: TableRow,
  b: TableRow,
  columnMeta: TableCompareColumnMeta
) {
  const av = String(a[0].sortValue);
  const bv = String(b[0].sortValue);

  if (isSemver(av) && isSemver(bv)) {
    return semverCompare(av, bv) * columnMeta.direction;
  }

  return 0;
}
