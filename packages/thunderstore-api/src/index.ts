/**
 * TODO: this is a naive implementation. Actual process should include:
 * - Accepting config as a parameter (to e.g. define backend URL)
 * - Parsing URLs from parameters in a typesafe manner
 * - Optimizing query parameters for better caching
 * - Validating response format
 * - Handling errors
 */

export interface RequestConfig {
  apiHost: string;
  sessionId?: string;
}

async function apiFetch(path: string) {
  const response = await fetch(path);
  return await response.json();
}

export async function fetchCommunityList() {
  return await apiFetch("https://thunderstore.dev/api/experimental/community/");
}
