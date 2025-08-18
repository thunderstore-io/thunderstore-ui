import { ApiEndpointProps } from "../index";
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

export async function fetchNamespacePackageListings(
  props: ApiEndpointProps<
    NamespacePackageListingsRequestParams,
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
  const path = `api/cyberstorm/listing/${params.community_id.toLowerCase()}/${params.namespace_id.toLowerCase()}/`;

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: undefined,
    queryParamsSchema: packageListingsRequestQueryParamsSchema,
    responseSchema: packageListingsResponseDataSchema,
  });
}
