import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  type PackageSitemapRequestQueryParams,
  packageSitemapRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import {
  type PackageSitemapResponseData,
  packageSitemapResponseDataSchema,
} from "../schemas/responseSchemas";

/**
 * Every publicly visible package listing, reduced to the fields a sitemap entry
 * needs. One page maps to one sitemap file.
 */
export async function fetchPackageSitemap(
  props: ApiEndpointProps<object, PackageSitemapRequestQueryParams, object>
): Promise<PackageSitemapResponseData> {
  const { config, queryParams = [] } = props;
  const path = "api/cyberstorm/sitemap/packages/";

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: undefined,
    queryParamsSchema: packageSitemapRequestQueryParamsSchema,
    responseSchema: packageSitemapResponseDataSchema,
  });
}
