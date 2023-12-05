import { RequestConfig } from "@thunderstore/thunderstore-api";
import { useApiConfig } from "./useApiConfig";

export type ApiEndpoint<Data, Meta, Result> = (
  config: RequestConfig,
  data: Data,
  meta: Meta
) => Promise<Result>;
export function useApiCall<Data, Meta, Result>(
  endpoint: ApiEndpoint<Data, Meta, Result>
): (data: Data, meta: Meta) => Promise<Result> {
  const apiConfig = useApiConfig();
  return (data: Data, meta: Meta) => endpoint(apiConfig, data, meta);
}
