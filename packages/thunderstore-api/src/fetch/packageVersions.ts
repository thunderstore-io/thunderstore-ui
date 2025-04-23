import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageVersions(
  config: () => RequestConfig,
  namespaceId: string,
  packageName: string
) {
  const path = `api/cyberstorm/package/${namespaceId}/${packageName}/versions/`;

  return await apiFetch(config, path);
}
