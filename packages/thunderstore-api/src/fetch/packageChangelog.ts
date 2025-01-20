import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageChangelog(
  config: () => RequestConfig,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const n = namespaceId.toLocaleLowerCase();
  const p = packageName.toLocaleLowerCase();
  const v = versionNumber ? `v/${versionNumber}` : `latest`;
  const path = `api/cyberstorm/package/${n}/${p}/${v}/changelog/`;

  return await apiFetch(config, path);
}
