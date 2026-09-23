import { apiFetch } from "../apiFetch";
import { ApiError } from "../index";
import type { ApiEndpointProps } from "../index";
import type { PackageVersionMarkdownRequestParams } from "../schemas/requestSchemas";
import { packageVersionRawMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionRawMarkdownResponseData } from "../schemas/responseSchemas";

/**
 * Fetches the resolved raw CHANGELOG of a version from the experimental API.
 * Serves the override when one exists, the packaged file otherwise. Served
 * from a five-minute server cache that edits do not bust.
 */
export function fetchPackageVersionChangelogMarkdownRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
): Promise<PackageVersionRawMarkdownResponseData> {
  const { config, params } = props;
  const path = `/api/experimental/package/${params.namespace}/${params.package}/${params.version}/changelog/`;

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

/**
 * Fetches the raw CHANGELOG override of a version from the download endpoint.
 * Returns null when the version has no CHANGELOG override. Plain-text
 * endpoint, so this bypasses apiFetch's JSON handling.
 */
export async function fetchPackageVersionChangelogOverrideRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRequestParams, object, object>
): Promise<string | null> {
  const { config, params } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/changelog/download/`;

  const response = await fetch(new URL(path, config().apiHost), {
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }
  return await response.text();
}
