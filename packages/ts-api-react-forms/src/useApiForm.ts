"use client";

import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleFormApiErrors } from "./errors";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";

export type UseApiFormArgs<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  schema: Schema;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
};
export type UseApiFormReturn<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  form: UseFormReturn<z.infer<Schema>>;
  submitHandler: (data: z.infer<Schema>) => Promise<Result>;
};
export function useApiForm<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(
  args: UseApiFormArgs<Schema, Result, Z>
): UseApiFormReturn<Schema, Result, Z> {
  const { schema, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const form = useForm<z.infer<Schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });
  const submitHandler = async (data: z.infer<Schema>) => {
    try {
      return await apiCall(data);
    } catch (e) {
      handleFormApiErrors(e, schema, form.setError);
      throw e;
    }
  };

  return { form, submitHandler };
}
