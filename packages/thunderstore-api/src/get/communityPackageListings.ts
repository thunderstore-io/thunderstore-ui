import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { PackageListingsOrderingEnum } from "../schemas/queryParamSchemas";
import {
  type CommunityPackageListingsRequestParams,
  type PackageListingsRequestQueryParams,
  communityPackageListingsRequestParamsSchema,
  packageListingsRequestQueryParamsSchema,
} from "../schemas/requestSchemas";
import {
  type PackageListingsResponseData,
  packageListingsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCommunityPackageListings(
  props: ApiEndpointProps<
    CommunityPackageListingsRequestParams,
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
  return await apiFetch({
    args: {
      config,
      path: `api/cyberstorm/listing/${params.community_id.toLowerCase()}/`,
      queryParams,
    },
    requestSchema: communityPackageListingsRequestParamsSchema,
    queryParamsSchema: packageListingsRequestQueryParamsSchema,
    responseSchema: packageListingsResponseDataSchema,
  });
}
