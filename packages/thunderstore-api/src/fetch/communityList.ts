import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { serializeQueryString } from "../queryString";

export async function fetchCommunityList(
  config: RequestConfig,
  page = 1,
  ordering = "name",
  search?: string
) {
  const path = "api/cyberstorm/community/";

  const queryParams = [
    { key: "ordering", value: ordering, impotent: "identifier" },
    { key: "page", value: page, impotent: 1 },
    { key: "search", value: search?.trim() },
  ];
  const query = serializeQueryString(queryParams);

  return await apiFetch(config, path, query);
}
