import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageDependantsListingsRequestParams,
  PackageListingsRequestQueryParams,
  packageListingsRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import { z } from "zod";
import { PackageListingsOrderingEnum } from "../schemas/queryParamSchemas";
import {
  PackageListingsResponseData,
  packageListingsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchPackageDependantsListings(
  config: () => RequestConfig,
  params: PackageDependantsListingsRequestParams,
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
  const c = params.community_id.toLocaleLowerCase();
  const n = params.namespace_id.toLocaleLowerCase();
  const p = params.package_name.toLocaleLowerCase();
  const path = `api/cyberstorm/listing/${c}/${n}/${p}/dependants/`;

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: z.object({}),
    queryParamsSchema: packageListingsRequestQueryParamsSchema,
    responseSchema: packageListingsResponseDataSchema,
  });
}
