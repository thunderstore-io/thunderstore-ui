"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";

export type UseApiActionArgs<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  metaData: any;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
};
export function useApiAction<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(args: UseApiActionArgs<Schema, Result, Z>) {
  const { metaData, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const submitHandler = async (data: z.infer<Schema>) => {
    return await apiCall(data, metaData);
  };

  return submitHandler;
}
