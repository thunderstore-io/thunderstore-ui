import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchRatedPackages(config: () => RequestConfig) {
  const path = "api/experimental/current-user/rated-packages/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch(config, path, undefined, request, true);
}
