import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  type PackageVersionMarkdownRequestParams,
  type PackageVersionReadmeRequestData,
  packageVersionReadmeRequestDataSchema,
} from "../schemas/requestSchemas";
import { packageVersionMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionMarkdownResponseData } from "../schemas/responseSchemas";

/** Saves a version's README override, or discards it when readme is null. */
export function postPackageVersionReadme(
  props: ApiEndpointProps<
    PackageVersionMarkdownRequestParams,
    object,
    PackageVersionReadmeRequestData
  >
): Promise<PackageVersionMarkdownResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      bodyRaw: data,
      useSession: true,
    },
    requestSchema: packageVersionReadmeRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageVersionMarkdownResponseDataSchema,
  });
}
