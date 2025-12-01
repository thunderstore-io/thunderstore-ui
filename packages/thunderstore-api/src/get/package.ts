import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { type PackagePermissionsRequestParams } from "../schemas/requestSchemas";
import {
  type PackagePermissionsResponseData,
  packagePermissionsResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchPackagePermissions(
  props: ApiEndpointProps<PackagePermissionsRequestParams, object, object>
): Promise<PackagePermissionsResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/package/${params.community_id}/${params.namespace_id}/${params.package_name}/permissions`;
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: {
      config: config,
      path: path,
      request: request,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packagePermissionsResponseDataSchema,
  });
}
