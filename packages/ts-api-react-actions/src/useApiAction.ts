import { z, ZodObject, ZodRawShape } from "zod";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export type UseApiActionArgs<
  Schema extends ZodObject<Z>,
  ReturnSchema extends ZodObject<Z>,
  Meta extends object,
  Z extends ZodRawShape,
> = {
  config: () => RequestConfig;
  endpoint: ApiEndpoint<z.infer<Schema>, Meta, ReturnSchema>;
};
export function useApiAction<
  Schema extends ZodObject<Z>,
  ReturnSchema extends ZodObject<Z>,
  Meta extends object,
  Z extends ZodRawShape,
>(args: UseApiActionArgs<Schema, ReturnSchema, Meta, Z>) {
  const { config, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const submitHandler = async (data: z.infer<Schema>, meta: Meta) => {
    return await apiCall(config, data, meta);
  };

  return submitHandler;
}
