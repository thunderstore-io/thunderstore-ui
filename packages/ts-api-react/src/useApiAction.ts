"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { ApiEndpoint, useApiCall } from "./useApiCall";

export type UseApiActionArgs<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape
> = {
  meta: Meta;
  endpoint: ApiEndpoint<z.infer<Schema>, Meta, Result>;
};
export function useApiAction<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape
>(args: UseApiActionArgs<Schema, Meta, Result, Z>) {
  const { meta, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const submitHandler = async (data: z.infer<Schema>) => {
    return await apiCall(data, meta);
  };

  return submitHandler;
}
