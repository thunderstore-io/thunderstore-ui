import { fetchDynamicHTML } from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

export async function getDynamicHTML(
  this: DapperTsInterface,
  placement: string
) {
  const data = await fetchDynamicHTML({
    config: this.config,
    params: { placement },
    data: {},
    queryParams: {},
  });

  return data.dynamic_htmls;
}
