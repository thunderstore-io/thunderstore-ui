import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { type PackageChangelogRequestParams } from "../schemas/requestSchemas";
import {
  type PackageChangelogResponseData,
  packageChangelogResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchPackageChangelog(
  props: ApiEndpointProps<PackageChangelogRequestParams, object, object>
): Promise<PackageChangelogResponseData> {
  const { config, params } = props;
  const v =
    params.version_number === "latest" || params.version_number === undefined
      ? "latest"
      : `v/${params.version_number}`;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/${v}/changelog/`;

  return apiFetch({
    config,
    path,
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageChangelogResponseDataSchema,
  });
}
