import { fetchRatedPackages } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";

export async function getRatedPackages(this: DapperTsInterface) {
  const data = await fetchRatedPackages({
    config: this.config,
    params: {},
    data: {},
    queryParams: {},
  });

  return data;
}
