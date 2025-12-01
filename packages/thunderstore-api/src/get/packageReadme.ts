import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { type PackageReadmeRequestParams } from "../schemas/requestSchemas";
import {
  type PackageReadmeResponseData,
  packageReadmeResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchPackageReadme(
  props: ApiEndpointProps<PackageReadmeRequestParams, object, object>
): Promise<PackageReadmeResponseData> {
  const { config, params } = props;
  const v =
    params.version_number === "latest" || params.version_number === undefined
      ? "latest"
      : `v/${params.version_number}`;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/${v}/readme/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageReadmeResponseDataSchema,
  });
}
