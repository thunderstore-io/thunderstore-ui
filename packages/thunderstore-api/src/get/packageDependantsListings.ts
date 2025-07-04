import { ApiEndpointProps } from "../index";
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
  props: ApiEndpointProps<
    PackageDependantsListingsRequestParams,
    PackageListingsRequestQueryParams,
    object
  >
): Promise<PackageListingsResponseData> {
  const {
    config,
    params,
    queryParams = [
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
    ],
  } = props;
  const path = `api/cyberstorm/listing/${params.community_id}/${params.namespace_id}/${params.package_name}/dependants/`;

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
