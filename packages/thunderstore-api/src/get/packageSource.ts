import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { type PackageSourceRequestParams } from "../schemas/requestSchemas";
import { packageSourceResponseDataSchema } from "../schemas/responseSchemas";
import { type PackageSourceResponseData } from "../schemas/responseSchemas";

export function fetchPackageSource(
  props: ApiEndpointProps<PackageSourceRequestParams, object, object>
): Promise<PackageSourceResponseData> {
  const { config, params } = props;
  const v = params.version_number ? params.version_number : "latest";
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/v/${v}/source/`;

  return apiFetch({
    config: config,
    path: path,
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageSourceResponseDataSchema,
  });
}
