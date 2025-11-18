import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  communityPackageListingsRequestParamsSchema,
  CommunityPackageListingsRequestParams,
  packageListingsRequestQueryParamsSchema,
  PackageListingsRequestQueryParams,
} from "../schemas/requestSchemas";
import { PackageListingsOrderingEnum } from "../schemas/queryParamSchemas";
import {
  PackageListingsResponseData,
  packageListingsResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchCommunityPackageListings(
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
  return apiFetch({
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
