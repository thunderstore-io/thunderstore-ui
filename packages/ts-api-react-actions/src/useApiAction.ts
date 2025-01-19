import { z, ZodObject, ZodRawShape } from "zod";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export type UseApiActionArgs<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
> = {
  config: () => RequestConfig;
  meta: Meta;
  endpoint: ApiEndpoint<z.infer<Schema>, Meta, Result>;
};
export function useApiAction<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
>(args: UseApiActionArgs<Schema, Meta, Result, Z>) {
  const { config, meta, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const submitHandler = async (data: z.infer<Schema>) => {
    return await apiCall(config, data, meta);
  };

  return submitHandler;
}
