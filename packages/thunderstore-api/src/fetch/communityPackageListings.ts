import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  packageListingsRequestParamsSchema,
  PackageListingsRequestQueryParams,
  packageListingsRequestQueryParamsSchema,
  PackageListingsRequestParams,
} from "../schemas/requestSchemas";
import { PackageListingsOrderingEnum } from "../schemas/queryParamSchemas";
import {
  PackageListingsResponseData,
  packageListingsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCommunityPackageListings(
  config: () => RequestConfig,
  params: PackageListingsRequestParams,
  queryParams: PackageListingsRequestQueryParams = [
    {
      key: "ordering",
      value: PackageListingsOrderingEnum.Updated,
      impotent: PackageListingsOrderingEnum.Updated,
    },
    { key: "page", value: 1, impotent: 1 },
    { key: "q", value: "" },
    { key: "included_categories", value: [] },
    { key: "excluded_categories", value: [] },
    { key: "section", value: "" },
    { key: "nsfw", value: false, impotent: false },
    { key: "deprecated", value: false, impotent: false },
  ]
): Promise<PackageListingsResponseData> {
  return await apiFetch({
    args: {
      config,
      path: `api/cyberstorm/listing/${params.community_id.toLowerCase()}/`,
      queryParams,
    },
    requestSchema: packageListingsRequestParamsSchema,
    queryParamsSchema: packageListingsRequestQueryParamsSchema,
    responseSchema: packageListingsResponseDataSchema,
  });
}
