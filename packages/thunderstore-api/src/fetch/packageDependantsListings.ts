import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { serializeQueryString } from "../queryString";
import { PackageListingQueryParams } from "../types";

export async function fetchPackageDependantsListings(
  config: RequestConfig,
  communityId: string,
  namespaceId: string,
  packageName: string,
  options?: PackageListingQueryParams
) {
  const c = communityId.toLocaleLowerCase();
  const n = namespaceId.toLocaleLowerCase();
  const p = packageName.toLocaleLowerCase();
  const path = `api/cyberstorm/listing/${c}/${n}/${p}/dependants/`;

  const queryParams = [
    { key: "ordering", value: options?.ordering, impotent: "last-updated" },
    { key: "page", value: options?.page, impotent: 1 },
    { key: "q", value: options?.q.trim() },
    { key: "included_categories", value: options?.includedCategories },
    { key: "excluded_categories", value: options?.excludedCategories },
    { key: "section", value: options?.section },
    { key: "nsfw", value: options?.nsfw, impotent: false },
    { key: "deprecated", value: options?.deprecated, impotent: false },
  ];
  const query = serializeQueryString(queryParams);

  return await apiFetch(config, path, query);
}
