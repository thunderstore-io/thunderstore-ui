"use client";

import { HTMLAttributes, PropsWithChildren, useCallback } from "react";
import { z, ZodObject, ZodRawShape } from "zod";
import { ApiError, RequestConfig } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { FormProvider } from "react-hook-form";
import { useApiForm } from "./useApiForm";

export type ApiFormProps<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
> = {
  schema: Schema;
  endpoint: ApiEndpoint<RequestConfig, z.infer<Schema>, Meta, Result>;
  meta: Meta;
  onSubmitSuccess?: (result: Result) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
  config: RequestConfig;
  formProps?: Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">;
};
export function ApiForm<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
>(props: PropsWithChildren<ApiFormProps<Schema, Meta, Result, Z>>) {
  const { config, schema, meta, endpoint, onSubmitSuccess, onSubmitError } =
    props;
  const { form, submitHandler } = useApiForm({
    schema: schema,
    meta: meta,
    endpoint: endpoint,
  });
  const onSubmit = useCallback(
    async (data: z.infer<Schema>) => {
      try {
        const result = await submitHandler(config, data);
        if (onSubmitSuccess) {
          onSubmitSuccess(result);
        }
      } catch (e) {
        if (onSubmitError) {
          onSubmitError(e);
        } else {
          throw e;
        }
      }
    },
    [onSubmitSuccess, onSubmitError]
  );

  return (
    <FormProvider {...form}>
      <form {...props.formProps} onSubmit={form.handleSubmit(onSubmit)}>
        {props.children}
      </form>
    </FormProvider>
  );
}

ApiForm.displayName = "ApiForm";
