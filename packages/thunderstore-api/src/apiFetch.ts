import { RequestConfig } from "./index";

export async function apiFetch(
  config: RequestConfig,
  path: string,
  query: string
) {
  const url = getUrl(config, path, query);
  const settings = getSettings(config);
  const response = await fetch(url, settings);
  return await response.json();
}

function getSettings(config: RequestConfig) {
  return config.sessionId
    ? { headers: { authorization: `Session ${config.sessionId}` } }
    : {};
}

function getUrl(config: RequestConfig, path: string, query: string) {
  const fullPath = query ? `${path}?${query}` : path;
  return new URL(fullPath, config.apiHost);
}
