"use client";

import { HTMLAttributes, PropsWithChildren, useCallback } from "react";
import { FormProvider } from "react-hook-form";
import z, { ZodObject, ZodRawShape } from "zod";

import {
  ApiEndpointProps,
  ApiError,
  RequestConfig,
} from "@thunderstore/thunderstore-api";

import { useApiForm } from "./useApiForm";

export function ApiForm<
  Params extends object,
  QueryParams extends object,
  Schema extends ZodObject<ZodRawShape>,
  Return,
>(
  props: PropsWithChildren<{
    endpoint: (
      props: ApiEndpointProps<Params, QueryParams, z.infer<Schema>>
    ) => Return;
    params?: Params;
    queryParams?: QueryParams;
    // data?: Data;
    config: () => RequestConfig;
    onSubmitSuccess?: (result?: Return, message?: string) => void;
    onSubmitError?: (error?: Error | ApiError, message?: string) => void;
    formProps?: Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">;
  }> & {
    schema: Schema;
  }
) {
  const { endpoint, onSubmitSuccess, onSubmitError, schema } = props;
  const { form, submitHandler } = useApiForm<
    typeof schema,
    Params,
    QueryParams,
    z.infer<Schema>,
    ReturnType<typeof endpoint>
  >({
    endpoint: endpoint,
    schema: schema,
  });
  const onSubmit = useCallback(
    async (onSubmitData: z.infer<Schema>) => {
      try {
        const result = await submitHandler({
          params: props.params ? props.params : ({} as Params),
          queryParams: props.queryParams
            ? props.queryParams
            : ({} as QueryParams),
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
