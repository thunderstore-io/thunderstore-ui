import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { packageVersionsResponseDataSchema } from "../schemas/responseSchemas";
import { PackageVersionsRequestParams } from "../schemas/requestSchemas";
import { PackageVersionsResponseData } from "../schemas/responseSchemas";

export function fetchPackageVersions(
  props: ApiEndpointProps<PackageVersionsRequestParams, object, object>
): Promise<PackageVersionsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/versions/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageVersionsResponseDataSchema,
  });
}
