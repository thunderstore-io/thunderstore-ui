import {
  RatedPackagesResponseData,
  fetchRatedPackages,
} from "@thunderstore/thunderstore-api";

import { type DapperTsInterface } from "../index";

export function getRatedPackages(
  this: DapperTsInterface
): Promise<RatedPackagesResponseData> {
  return fetchRatedPackages({
    config: this.config,
    params: {},
    data: {},
    queryParams: {},
  });
}
