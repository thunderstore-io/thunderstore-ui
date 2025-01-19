import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchCurrentUser(config: () => RequestConfig) {
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch(config, path, undefined, request, true);
}
