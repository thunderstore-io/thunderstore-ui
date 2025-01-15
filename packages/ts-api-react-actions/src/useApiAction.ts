import { z, ZodObject, ZodRawShape } from "zod";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";

export type UseApiActionArgs<
  RequestConfig,
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
> = {
  config: RequestConfig;
  meta: Meta;
  endpoint: ApiEndpoint<RequestConfig, z.infer<Schema>, Meta, Result>;
};
export function useApiAction<
  ConfigPromise,
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
>(args: UseApiActionArgs<ConfigPromise, Schema, Meta, Result, Z>) {
  const { config, meta, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const submitHandler = async (data: z.infer<Schema>) => {
    return await apiCall(config, data, meta);
  };

  return submitHandler;
}
