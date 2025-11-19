import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { packageListingDetailsSchema } from "../schemas/objectSchemas";
import { PackageListingDetailsRequestParams } from "../schemas/requestSchemas";
import { PackageListingDetailsResponseData } from "../schemas/responseSchemas";

export function fetchPackageListingDetails(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/listing/${params.community_id}/${params.namespace_id}/${params.package_name}/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageListingDetailsSchema,
  });
}
