import { apiFetch } from "../apiFetch";
import { ApiError } from "../index";
import type { ApiEndpointProps } from "../index";
import type { PackageVersionMarkdownRequestParams } from "../schemas/requestSchemas";
import { packageVersionRawMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionRawMarkdownResponseData } from "../schemas/responseSchemas";

export function fetchPackageVersionReadmeMarkdownRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
): Promise<PackageVersionRawMarkdownResponseData> {
  const { config, params } = props;
  const path = `/api/experimental/package/${params.namespace}/${params.package}/${params.version}/readme/`;

  return apiFetch({
    args: {
      config,
      path,
      request: { cache: "no-store" },
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageVersionRawMarkdownResponseDataSchema,
  });
}

// Plain text, so this skips apiFetch. Null when the version has no override.
export async function fetchPackageVersionReadmeOverrideRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
): Promise<string | null> {
  const { config, params } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/readme/download/`;

  const response = await fetch(new URL(path, config().apiHost), {
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }
  return await response.text();
}
