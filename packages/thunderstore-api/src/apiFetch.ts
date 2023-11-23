import { ApiError, RequestConfig } from "./index";

const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export type apiFetchArgs = {
  config: RequestConfig;
  path: string;
  query?: string;
  request?: Omit<RequestInit, "headers">;
};
export async function apiFetch2(args: apiFetchArgs) {
  const url = getUrl(args.config, args.path, args.query);

  const response = await fetch(url, {
    ...(args.request ?? {}),
    headers: {
      ...BASE_HEADERS,
      ...getAuthHeaders(args.config),
    },
  });

  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }

  return response.json();
}

export function apiFetch(config: RequestConfig, path: string, query?: string) {
  // TODO: Update the apiFetch signature to take in object args instead
  //       of positional arguments and then merge apiFetch and apiFetch2
  //       together. Someone else's job for now.
  return apiFetch2({
    config,
    path,
    query,
  });
}

function getAuthHeaders(config: RequestConfig): RequestInit["headers"] {
  return config.sessionId
    ? { Authorization: `Session ${config.sessionId}` }
    : {};
}

function getUrl(config: RequestConfig, path: string, query?: string) {
  const fullPath = query ? `${path}?${query}` : path;
  return new URL(fullPath, config.apiHost);
}
