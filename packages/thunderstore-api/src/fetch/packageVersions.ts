import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageVersions(
  config: RequestConfig,
  namespaceId: string,
  packageName: string
) {
  const n = namespaceId.toLocaleLowerCase();
  const p = packageName.toLocaleLowerCase();
  const path = `api/cyberstorm/versions/${n}/${p}/`;

  return await apiFetch(config, path);
}
