import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { PackageVersionDetailsRequestParams } from "../schemas/requestSchemas";
import {
  PackageVersionDetailsResponseData,
  packageVersionDetailsResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchPackageVersionDetails(
  props: ApiEndpointProps<PackageVersionDetailsRequestParams, object, object>
): Promise<PackageVersionDetailsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/v/${params.package_version}/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageVersionDetailsResponseDataSchema,
  });
}
