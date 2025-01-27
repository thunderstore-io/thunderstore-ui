import { PackageCategory } from "@thunderstore/dapper/types";

export const TRISTATE_STATES = ["off", "include", "exclude"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type TRISTATE = typeof TRISTATE_STATES[number];

export interface CategorySelection extends PackageCategory {
  // TODO: IDE disagrees with what precommit prettier wants, fix config.
  // eslint-disable-next-line prettier/prettier
  selection: (typeof TRISTATE_STATES)[number];
}
