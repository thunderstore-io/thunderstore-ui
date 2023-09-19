import { RequestConfig } from "..";
import { apiFetch } from "../apiFetch";

export async function fetchCommunityList(config: RequestConfig) {
  const path = "api/cyberstorm/community/";

  return await apiFetch(config, path);
}
