import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { packageVersionRawMarkdownResponseDataSchema } from "../schemas/responseSchemas";
import type { PackageVersionRawMarkdownResponseData } from "../schemas/responseSchemas";

interface PackageVersionMarkdownRawParams {
  namespace: string;
  package: string;
  version: string;
}

/**
 * Fetches the resolved raw markdown of a version's README or CHANGELOG from
 * the experimental API. Serves the override when one exists, the packaged
 * file otherwise, which makes it the right source for prefilling the editor.
 */
export function fetchPackageVersionMarkdownRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRawParams, object, object> & {
    document: "readme" | "changelog";
  }
): Promise<PackageVersionRawMarkdownResponseData> {
  const { config, params, document } = props;
  const path = `/api/experimental/package/${params.namespace}/${params.package}/${params.version}/${document}/`;

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
 * Fetches the raw markdown of a version's override from the download
 * endpoint. Returns null when the version has no override for the document.
 * Plain-text endpoint, so this bypasses apiFetch's JSON handling.
 */
export async function fetchPackageVersionOverrideRaw(
  props: ApiEndpointProps<PackageVersionMarkdownRawParams, object, object> & {
    document: "readme" | "changelog";
  }
): Promise<string | null> {
  const { config, params, document } = props;
  const resolved = config();
  const url = `${resolved.apiHost}/api/cyberstorm/package/${params.namespace}/${params.package}/v/${params.version}/markdown/${document}/download/`;

  const response = await fetch(url, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Override download failed: ${response.status}`);
  }
  return await response.text();
}
