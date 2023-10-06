import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchCommunity(
  config: RequestConfig,
  communityId: string
) {
  const path = `api/cyberstorm/community/${communityId}/`;

  return await apiFetch(config, path);
}
