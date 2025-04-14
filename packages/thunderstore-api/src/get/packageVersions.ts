import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { packageVersionsResponseDataSchema } from "../schemas/responseSchemas";
import { PackageVersionsRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";
import { PackageVersionsResponseData } from "../schemas/responseSchemas";

export async function fetchPackageVersions(
  config: () => RequestConfig,
  params: PackageVersionsRequestParams
): Promise<PackageVersionsResponseData> {
  const n = params.namespace_id.toLocaleLowerCase();
  const p = params.package_name.toLocaleLowerCase();
  const path = `api/cyberstorm/package/${n}/${p}/versions/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageVersionsResponseDataSchema,
  });
}
