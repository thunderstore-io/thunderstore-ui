import { RequestConfig } from "@thunderstore/thunderstore-api";

export type ApiEndpoint<Data, Meta, Result> = (
  config: () => RequestConfig,
  data: Data,
  meta: Meta
) => Promise<Result>;
export function useApiCall<Data, Meta, Result>(
  endpoint: ApiEndpoint<Data, Meta, Result>
): (config: () => RequestConfig, data: Data, meta: Meta) => Promise<Result> {
  return (config: () => RequestConfig, data: Data, meta: Meta) => {
    return endpoint(config, data, meta);
  };
}
