import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageReadme(
  config: () => RequestConfig,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const v = versionNumber ? `v/${versionNumber}` : `latest`;
  const path = `api/cyberstorm/package/${namespaceId}/${packageName}/${v}/readme/`;

  return await apiFetch(config, path);
}
