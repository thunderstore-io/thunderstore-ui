import { fetchRatedPackages } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getRatedPackages(this: DapperTsInterface) {
  return fetchRatedPackages({
    config: this.config,
    params: {},
    data: {},
    queryParams: {},
  });
}
