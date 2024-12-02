import { ApiError, RequestConfig } from "./index";

const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const MAX_NB_RETRY = 5;
const RETRY_DELAY_MS = 200;

async function fetchRetry(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  let retryLeft = MAX_NB_RETRY;
  let latestErr = null;
  while (retryLeft > 0) {
    try {
      return await fetch(input, init);
    } catch (err) {
      latestErr = err;
      await sleep(RETRY_DELAY_MS);
    } finally {
      retryLeft -= 1;
    }
  }
  if (latestErr !== null) {
    throw latestErr;
  } else {
    throw new Error(`Too many retries`);
  }
}

function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export type apiFetchArgs = {
  config: RequestConfig;
  path: string;
  query?: string;
  request?: Omit<RequestInit, "headers">;
  useSession?: boolean;
};
export async function apiFetch2(args: apiFetchArgs) {
  const { config, path, request, query, useSession = false } = args;
  const usedConfig: RequestConfig = useSession
    ? config
    : { apiHost: config.apiHost, csrfToken: undefined, sessionId: undefined };
  const url = getUrl(usedConfig, path, query);

  const response = await fetchRetry(url, {
    ...(request ?? {}),
    headers: {
      ...BASE_HEADERS,
      ...getAuthHeaders(usedConfig),
    },
  });

  if (!response.ok) {
    throw await ApiError.createFromResponse(response);
  }

  return response.json();
}

export function apiFetch(
  config: RequestConfig,
  path: string,
  query?: string,
  request?: Omit<RequestInit, "headers">,
  useSession?: boolean
) {
  // TODO: Update the apiFetch signature to take in object args instead
  //       of positional arguments and then merge apiFetch and apiFetch2
  //       together. Someone else's job for now.
  return apiFetch2({
    config,
    path,
    query,
    request,
    useSession,
  });
}

function getAuthHeaders(config: RequestConfig): RequestInit["headers"] {
  return config.sessionId
    ? {
        Authorization: `Session ${config.sessionId}`,
        "X-Csrftoken": config.csrfToken ? config.csrfToken : "",
      }
    : {};
}

function getUrl(config: RequestConfig, path: string, query?: string) {
  const fullPath = query ? `${path}?${query}` : path;
  return new URL(fullPath, config.apiHost);
}
