import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { serializeQueryString } from "../queryString";
import { PackageListingQueryParams } from "../types";

export async function fetchCommunityPackageListings(
  config: RequestConfig,
  communityId: string,
  options?: PackageListingQueryParams
) {
  const path = `api/cyberstorm/listing/${communityId.toLowerCase()}/`;

  const queryParams = [
    { key: "ordering", value: options?.ordering, impotent: "last-updated" },
    { key: "page", value: options?.page, impotent: 1 },
    { key: "q", value: options?.q.trim() },
    { key: "included_categories", value: options?.includedCategories },
    { key: "excluded_categories", value: options?.excludedCategories },
    { key: "section", value: options?.section },
    { key: "nsfw", value: options?.nsfw, impotent: false },
    { key: "deprecated", value: options?.deprecated, impotent: false },
    { key: "created_after", value: options?.created_after },
    { key: "created_before", value: options?.created_before },
    { key: "updated_after", value: options?.updated_after },
    { key: "updated_before", value: options?.updated_before },
  ];
  const query = serializeQueryString(queryParams);

  return await apiFetch(config, path, query);
}
