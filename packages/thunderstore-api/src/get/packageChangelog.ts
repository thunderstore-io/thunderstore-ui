import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { PackageChangelogRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";
import {
  PackageChangelogResponseData,
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
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageChangelogResponseDataSchema,
  });
}
