import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  packageListingDetailsSchema,
  packageListingStatusSchema,
} from "../schemas/objectSchemas";
import { PackageListingDetailsRequestParams } from "../schemas/requestSchemas";
import {
  PackageListingDetailsResponseData,
  PackageListingStatusResponseData,
} from "../schemas/responseSchemas";

const basePath = "api/cyberstorm/listing/";

export async function fetchPackageListingDetails(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingDetailsResponseData> {
  const { config, params, useSession } = props;
  const path = `${basePath}${params.community_id}/${params.namespace_id}/${params.package_name}/`;

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
  const path = `${basePath}${params.community_id}/${params.namespace_id}/${params.package_name}/status/`;

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
