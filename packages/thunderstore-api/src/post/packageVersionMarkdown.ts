import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  type PackageVersionMarkdownRequestData,
  type PackageVersionMarkdownRequestParams,
  packageVersionMarkdownRequestDataSchema,
} from "../schemas/requestSchemas";
import { packageVersionMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionMarkdownResponseData } from "../schemas/responseSchemas";

export function postPackageVersionMarkdown(
  props: ApiEndpointProps<
    PackageVersionMarkdownRequestParams,
    object,
    PackageVersionMarkdownRequestData
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
      useSession: true,
    },
    requestSchema: packageVersionMarkdownRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageVersionMarkdownResponseDataSchema,
  });
}
