import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageVersionMarkdownRequestParams } from "../schemas/requestSchemas";
import { packageVersionRawMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionRawMarkdownResponseData } from "../schemas/responseSchemas";

export function deletePackageVersionReadmeOverride(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
): Promise<PackageVersionRawMarkdownResponseData> {
  const { config, params } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/readme/delete/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
      },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageVersionRawMarkdownResponseDataSchema,
  });
}
