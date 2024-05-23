import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export async function fetchDynamicHTML(
  config: RequestConfig,
  placement: string
) {
  const path = `api/cyberstorm/dynamichtml/${placement}`;

  return await apiFetch(config, path);
}
