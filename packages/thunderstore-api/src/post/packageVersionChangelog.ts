import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  type PackageVersionChangelogRequestData,
  type PackageVersionMarkdownRequestParams,
  packageVersionChangelogRequestDataSchema,
} from "../schemas/requestSchemas";
import { packageVersionMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionMarkdownResponseData } from "../schemas/responseSchemas";

/** Saves a version's CHANGELOG override, or discards it when changelog is null. */
export function postPackageVersionChangelog(
  props: ApiEndpointProps<
    PackageVersionMarkdownRequestParams,
    object,
    PackageVersionChangelogRequestData
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
    requestSchema: packageVersionChangelogRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageVersionMarkdownResponseDataSchema,
  });
}
