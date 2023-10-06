import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchCurrentUser(config: RequestConfig) {
  const path = "api/experimental/current-user/";

  return await apiFetch(config, path);
}
