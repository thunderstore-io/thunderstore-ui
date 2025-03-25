import { ThunderstoreApiError } from "./errors";

export type RequestMethod = "GET" | "POST" | "DELETE";

export type ApiFetchArgs = {
  url: string;
  method: RequestMethod;
  data?: object;
  authorization?: string;
};

export async function apiFetch({
  url,
  method,
  data,
  authorization,
}: ApiFetchArgs) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (authorization) {
    headers.set("Authorization", authorization);
  }
  const result = await fetch(url, {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (result.status < 200 || result.status >= 300) {
    const message = `Invalid HTTP response status: ${result.status} ${result.statusText}`;
    throw await ThunderstoreApiError.createFromResponse(message, result);
  }
  return result;
}

function parseXhrResponseHeaders(allHeaders: string): Headers {
  const result = new Headers();
  allHeaders
    .trim()
    .split(/[\r\n]+/)
    .map((value) => value.split(/: /))
    .forEach((kvp) => {
      if (kvp.length == 2 && kvp[0] && kvp[1]) {
        result.set(kvp[0].toLowerCase(), kvp[1]);
      }
    });
  return result;
}

export type FetchArgs = {
  url: string;
  opts: Omit<RequestInit, "body" | "headers"> & {
    body: XMLHttpRequestBodyInit | null;
    headers?: Headers;
  };
  onProgress?: (this: XMLHttpRequest, ev: ProgressEvent) => any;
};
export function fetchWithProgress({ url, opts, onProgress }: FetchArgs): {
  request: XMLHttpRequest;
  response: Promise<Response>;
} {
  const xhr = new XMLHttpRequest();
  const response = new Promise<Response>((resolve, reject) => {
    xhr.open(opts.method || "get", url);

    if (opts.headers) {
      opts.headers.forEach((val, key) => {
        xhr.setRequestHeader(key, val);
      });
    }

    xhr.onload = () => {
      const headers = parseXhrResponseHeaders(xhr.getAllResponseHeaders());
      resolve(
        new Response(xhr.response, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers,
        })
      );
    };
    xhr.onerror = reject;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
    xhr.send(opts.body);
  });
  return { request: xhr, response: response };
}
