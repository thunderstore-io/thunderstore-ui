import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageChangelog(
  config: RequestConfig,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const n = namespaceId.toLocaleLowerCase();
  const p = packageName.toLocaleLowerCase();
  let path = `api/cyberstorm/changelog/${n}/${p}/`;

  if (versionNumber) {
    path = `${path}${versionNumber}/`;
  }

  return await apiFetch(config, path);
}
