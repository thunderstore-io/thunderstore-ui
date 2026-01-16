import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { BASE_LISTING_PATH } from "../index";
import {
  packageListingDetailsSchema,
  packageListingStatusSchema,
} from "../schemas/objectSchemas";
import type { PackageListingDetailsRequestParams } from "../schemas/requestSchemas";
import type {
  PackageListingDetailsResponseData,
  PackageListingStatusResponseData,
} from "../schemas/responseSchemas";

export async function fetchPackageListingDetails(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingDetailsResponseData> {
  const { config, params, useSession } = props;
  let path = `${BASE_LISTING_PATH}${params.community_id}/${params.namespace_id}/${params.package_name}/`;

  if (params.version_number) {
    path = `${path}v/${params.version_number}/`;
  }

  return await apiFetch({
    args: {
      config: config,
      path: path,
      useSession: useSession,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageListingDetailsSchema,
  });
}

export async function fetchPackageListingStatus(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingStatusResponseData> {
  const { config, params } = props;
  const path = `${BASE_LISTING_PATH}${params.community_id}/${params.namespace_id}/${params.package_name}/status/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageListingStatusSchema,
  });
}
