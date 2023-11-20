import { RequestConfig } from "@thunderstore/thunderstore-api";

export function useApiConfig(): RequestConfig {
  // TODO: Create context manager & read from there instead of hardcoding
  return {
    apiHost: "http://thunderstore.temp",
    sessionId: undefined,
  };
}
