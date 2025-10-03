import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { packageSourceResponseDataSchema } from "../schemas/responseSchemas";
import { PackageSourceRequestParams } from "../schemas/requestSchemas";
import { PackageSourceResponseData } from "../schemas/responseSchemas";

export async function fetchPackageSource(
  props: ApiEndpointProps<PackageSourceRequestParams, object, object>
): Promise<PackageSourceResponseData> {
  const { config, params } = props;
  const v = params.version_number ? params.version_number : "latest";
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/v/${v}/source/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageSourceResponseDataSchema,
  });
}
