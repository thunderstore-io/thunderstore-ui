import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageListingDetails(
  config: () => RequestConfig,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  const c = communityId.toLocaleLowerCase();
  const n = namespaceId.toLocaleLowerCase();
  const p = packageName.toLocaleLowerCase();
  const path = `api/cyberstorm/listing/${c}/${n}/${p}/`;

  return await apiFetch(config, path);
}
