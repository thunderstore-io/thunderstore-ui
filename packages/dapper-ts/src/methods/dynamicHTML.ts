import { fetchDynamicHTML } from "@thunderstore/thunderstore-api";

import { type DapperTsInterface } from "../index";

export async function getDynamicHTML(
  this: DapperTsInterface,
  placement: string
) {
  return fetchDynamicHTML({
    config: this.config,
    params: { placement },
    data: {},
    queryParams: {},
  });
}
