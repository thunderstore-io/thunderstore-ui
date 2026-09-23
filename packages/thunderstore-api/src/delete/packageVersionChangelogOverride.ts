import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { PackageVersionMarkdownRequestParams } from "../schemas/requestSchemas";

export function deletePackageVersionChangelogOverride(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
) {
  const { config, params } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/changelog/delete/`;

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
    responseSchema: undefined,
  });
}
