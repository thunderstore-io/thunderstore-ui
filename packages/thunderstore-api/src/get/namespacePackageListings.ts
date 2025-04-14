import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  NamespacePackageListingsRequestParams,
  PackageListingsRequestQueryParams,
  packageListingsRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import {
  PackageListingsResponseData,
  packageListingsResponseDataSchema,
} from "../schemas/responseSchemas";
import { PackageListingsOrderingEnum } from "../schemas/queryParamSchemas";
import { z } from "zod";

export async function fetchNamespacePackageListings(
  config: () => RequestConfig,
  params: NamespacePackageListingsRequestParams,
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
  const path = `api/cyberstorm/listing/${params.community_id.toLowerCase()}/${params.namespace_id.toLowerCase()}/`;

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
