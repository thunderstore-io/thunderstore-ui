import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchCommunityFilters(
  config: RequestConfig,
  communityId: string
) {
  const path = `api/cyberstorm/community/${communityId}/filters/`;

  return await apiFetch(config, path);
}
