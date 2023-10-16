import { PackageCategory } from "@thunderstore/dapper/types";

export const CATEGORY_STATES = ["off", "include", "exclude"] as const;

export interface CategorySelection extends PackageCategory {
  // TODO: IDE disagrees with what precommit prettier wants, fix config.
  // eslint-disable-next-line prettier/prettier
  selection: typeof CATEGORY_STATES[number];
}
