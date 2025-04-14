import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { PackageChangelogRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";
import {
  PackageChangelogResponseData,
  packageChangelogResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchPackageChangelog(
  config: () => RequestConfig,
  params: PackageChangelogRequestParams
): Promise<PackageChangelogResponseData> {
  const n = params.namespace_id.toLocaleLowerCase();
  const p = params.package_name.toLocaleLowerCase();
  const v =
    params.version_number === "latest"
      ? "latest"
      : `v/${params.version_number}`;
  const path = `api/cyberstorm/package/${n}/${p}/${v}/changelog/`;

  return await apiFetch({
    args: {
      config,
      path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageChangelogResponseDataSchema,
  });
}
