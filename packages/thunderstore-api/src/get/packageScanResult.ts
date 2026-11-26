import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageScanResultRequestParams } from "../schemas/requestSchemas";
import { packageScanResultResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageScanResultResponseData } from "../schemas/responseSchemas";

export async function fetchPackageScanResult(
  props: ApiEndpointProps<PackageScanResultRequestParams, object, object>
): Promise<PackageScanResultResponseData> {
  const { config, params } = props;
  const version = params.version_number ? `v/${params.version_number}/` : "";
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/${version}scan-result/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageScanResultResponseDataSchema,
  });
}
