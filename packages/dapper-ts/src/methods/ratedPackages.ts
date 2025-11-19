import {
  fetchRatedPackages,
  RatedPackagesResponseData,
} from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

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
