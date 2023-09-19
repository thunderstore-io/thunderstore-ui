import { RequestConfig } from "./index";

export async function apiFetch(config: RequestConfig, path: string) {
  const url = getUrl(config, path);
  const settings = getSettings(config);
  const response = await fetch(url, settings);
  return await response.json();
}

function getSettings(config: RequestConfig) {
  return config.sessionId
    ? { headers: { authorization: `Session ${config.sessionId}` } }
    : {};
}

function getUrl(config: RequestConfig, path: string) {
  return new URL(path, config.apiHost);
}
