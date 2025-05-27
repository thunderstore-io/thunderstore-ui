"use client";

import { HTMLAttributes, PropsWithChildren, useCallback } from "react";
import { ApiError, RequestConfig } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { FormProvider } from "react-hook-form";
import { useApiForm } from "./useApiForm";
import { ZodObject } from "zod";
import { ZodRawShape } from "zod";

export type ApiFormProps<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
  Schema extends ZodObject<ZodRawShape>,
> = {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
  params: Params;
  queryParams: QueryParams;
  // data?: Data;
  config: () => RequestConfig;
  onSubmitSuccess?: (result?: Return, message?: string) => void;
  onSubmitError?: (error?: Error | ApiError, message?: string) => void;
  formProps?: Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">;
  schema: Schema;
};
export function ApiForm<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
  Schema extends ZodObject<ZodRawShape>,
>(
  props: PropsWithChildren<
    ApiFormProps<Params, QueryParams, Data, Return, Schema>
  >
) {
  const { endpoint, onSubmitSuccess, onSubmitError, schema } = props;
  const { form, submitHandler } = useApiForm({
    endpoint: endpoint,
    schema: schema,
  });
  const onSubmit = useCallback(
    async (onSubmitData: Data) => {
      try {
        const result = await submitHandler({
          params: props.params,
          queryParams: props.queryParams,
          data: onSubmitData,
          config: props.config,
        });
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
