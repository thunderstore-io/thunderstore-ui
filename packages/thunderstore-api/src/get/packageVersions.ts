import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageVersionsRequestParams } from "../schemas/requestSchemas";
import { packageVersionsResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionsResponseData } from "../schemas/responseSchemas";

export async function fetchPackageVersions(
  props: ApiEndpointProps<PackageVersionsRequestParams, object, object>
): Promise<PackageVersionsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/versions/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageVersionsResponseDataSchema,
  });
}
