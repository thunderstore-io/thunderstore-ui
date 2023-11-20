"use client";

import { HTMLAttributes, PropsWithChildren, useCallback } from "react";
import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { FormProvider } from "react-hook-form";
import { useApiForm } from "./useApiForm";

export type ApiFormProps<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> = {
  schema: Schema;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
  onSubmitSuccess?: (result: Result) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
  formProps?: Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">;
};
export function ApiForm<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(props: PropsWithChildren<ApiFormProps<Schema, Result, Z>>) {
  const { schema, endpoint, onSubmitSuccess, onSubmitError } = props;
  const { form, submitHandler } = useApiForm({
    schema: schema,
    endpoint: endpoint,
  });
  const onSubmit = useCallback(
    async (data: z.infer<Schema>) => {
      try {
        const result = await submitHandler(data);
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
