import { RequestConfig } from "@thunderstore/thunderstore-api";
import { useApiConfig } from "./useApiConfig";

export type ApiEndpoint<Data, Result> = (
  config: RequestConfig,
  data: Data
) => Promise<Result>;
export function useApiCall<Data, Result>(
  endpoint: ApiEndpoint<Data, Result>
): (data: Data) => Promise<Result> {
  const apiConfig = useApiConfig();
  return (data: Data) => endpoint(apiConfig, data);
}
