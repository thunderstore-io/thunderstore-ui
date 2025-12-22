import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { packageListingDetailsSchema } from "../schemas/objectSchemas";
import type { PackageListingDetailsRequestParams } from "../schemas/requestSchemas";
import type { PackageListingDetailsResponseData } from "../schemas/responseSchemas";

export async function fetchPackageListingDetails(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/listing/${params.community_id}/${params.namespace_id}/${params.package_name}/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageListingDetailsSchema,
  });
}
