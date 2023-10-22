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
