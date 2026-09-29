import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageDownloadHistoryRequestParams } from "../schemas/requestSchemas";
import { packageDownloadHistoryResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageDownloadHistoryResponseData } from "../schemas/responseSchemas";

export async function fetchPackageDownloadHistory(
  props: ApiEndpointProps<PackageDownloadHistoryRequestParams, object, object>
): Promise<PackageDownloadHistoryResponseData> {
  const { config, params } = props;
  const path = `api/charts/downloads/${params.namespace_id}/${params.package_name}`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
      hostOverride: config().queryServiceHost,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageDownloadHistoryResponseDataSchema,
  });
}
