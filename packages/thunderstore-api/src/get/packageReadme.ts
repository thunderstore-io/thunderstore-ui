import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageReadmeResponseData,
  packageReadmeResponseDataSchema,
} from "../schemas/responseSchemas";
import { z } from "zod";
import { PackageReadmeRequestParams } from "../schemas/requestSchemas";
export async function fetchPackageReadme(
  config: () => RequestConfig,
  params: PackageReadmeRequestParams
): Promise<PackageReadmeResponseData> {
  const n = params.namespace_id.toLocaleLowerCase();
  const p = params.package_name.toLocaleLowerCase();
  const v =
    params.version_number === "latest"
      ? "latest"
      : `v/${params.version_number}`;
  const path = `api/cyberstorm/package/${n}/${p}/${v}/readme/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageReadmeResponseDataSchema,
  });
}
