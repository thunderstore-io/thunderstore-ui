import { z, ZodObject, ZodRawShape } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleFormApiErrors } from "./errors";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";
import { RequestConfig } from "@thunderstore/thunderstore-api";

export type UseApiFormArgs<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
> = {
  schema: Schema;
  meta: Meta;
  endpoint: ApiEndpoint<z.infer<Schema>, Meta, Result>;
};
export type UseApiFormReturn<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape,
> = {
  form: UseFormReturn<z.infer<Schema>>;
  submitHandler: (
    config: () => RequestConfig,
    data: z.infer<Schema>
  ) => Promise<Result>;
};
export function useApiForm<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
>(
  args: UseApiFormArgs<Schema, Meta, Result, Z>
): UseApiFormReturn<Schema, Result, Z> {
  const { schema, meta, endpoint } = args;
  const apiCall = useApiCall(endpoint);

  const form = useForm<z.infer<Schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });
  const submitHandler = async (
    config: () => RequestConfig,
    data: z.infer<Schema>
  ) => {
    try {
      return await apiCall(config, data, meta);
    } catch (e) {
      handleFormApiErrors(e, schema, form.setError);
      throw e;
    }
  };

  return { form, submitHandler };
}
