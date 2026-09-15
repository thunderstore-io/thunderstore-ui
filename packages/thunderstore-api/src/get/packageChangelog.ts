import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageChangelogRequestParams } from "../schemas/requestSchemas";
import {
  type PackageChangelogResponseData,
  packageChangelogResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchPackageChangelog(
  props: ApiEndpointProps<PackageChangelogRequestParams, object, object>
): Promise<PackageChangelogResponseData> {
  const { config, params } = props;
  const v =
    params.version_number === "latest" || params.version_number === undefined
      ? "latest"
      : `v/${params.version_number}`;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/${v}/changelog/`;

  return await apiFetch({
    args: {
      config,
      path,
      // Keep the browser HTTP cache out of the way so a site edit is
      // visible on the next navigation. Shared caches still apply.
      request: { cache: "no-store" },
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageChangelogResponseDataSchema,
  });
}
