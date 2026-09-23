import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  type PackageVersionMarkdownOverrideRequestData,
  type PackageVersionMarkdownRequestParams,
  packageVersionMarkdownOverrideRequestDataSchema,
} from "../schemas/requestSchemas";
import { packageVersionMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionMarkdownResponseData } from "../schemas/responseSchemas";

export function updatePackageVersionChangelogOverride(
  props: ApiEndpointProps<
    PackageVersionMarkdownRequestParams,
    object,
    PackageVersionMarkdownOverrideRequestData
  >
): Promise<PackageVersionMarkdownResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/changelog/update/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      bodyRaw: data,
      useSession: true,
    },
    requestSchema: packageVersionMarkdownOverrideRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageVersionMarkdownResponseDataSchema,
  });
}
