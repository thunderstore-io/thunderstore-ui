import { RequestConfig } from "./index";

/**
 * TODO: plug Sentry to error handling.
 */
export async function apiFetch(
  config: RequestConfig,
  path: string,
  query?: string
) {
  const url = getUrl(config, path, query);
  const settings = getSettings(config);

  let response;

  try {
    response = await fetch(url, settings);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Data fetching error");
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  let values;

  try {
    values = await response.json();
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Deserialization error");
  }

  return values;
}

function getSettings(config: RequestConfig) {
  return config.sessionId
    ? { headers: { authorization: `Session ${config.sessionId}` } }
    : {};
}

function getUrl(config: RequestConfig, path: string, query?: string) {
  const fullPath = query ? `${path}?${query}` : path;
  return new URL(fullPath, config.apiHost);
}
