import { fetchPackageSitemap } from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

/**
 * One page of package listings for sitemap generation. `pageSize` maps a page
 * to a sitemap file; pass 1 to read `count` cheaply.
 */
export async function getPackageSitemapPage(
  this: DapperTsInterface,
  page: number,
  pageSize: number
) {
  const data = await fetchPackageSitemap({
    config: this.config,
    queryParams: [
      { key: "page", value: page, impotent: 1 },
      { key: "page_size", value: pageSize, impotent: 0 },
    ],
    params: {},
    data: {},
  });

  return {
    count: data.count,
    hasMore: Boolean(data.next),
    results: data.results,
  };
}
