export type ApiEndpoint<RequestConfig, Data, Meta, Result> = (
  config: RequestConfig,
  data: Data,
  meta: Meta
) => Promise<Result>;
export function useApiCall<RequestConfig, Data, Meta, Result>(
  endpoint: ApiEndpoint<RequestConfig, Data, Meta, Result>
): (config: RequestConfig, data: Data, meta: Meta) => Promise<Result> {
  return (config: RequestConfig, data: Data, meta: Meta) => {
    return endpoint(config, data, meta);
  };
}
