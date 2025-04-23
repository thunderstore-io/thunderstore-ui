import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchPackageListingDetails(
  config: () => RequestConfig,
  communityId: string,
  namespaceId: string,
  packageName: string
) {
  const c = communityId.toLocaleLowerCase();
  const path = `api/cyberstorm/listing/${c}/${namespaceId}/${packageName}/`;

  return await apiFetch(config, path);
}
