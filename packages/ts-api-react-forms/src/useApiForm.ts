import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { ZodObject, ZodRawShape } from "zod";

import { ApiEndpointProps } from "@thunderstore/thunderstore-api";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";

import { handleFormApiErrors } from "./errors";

export type UseApiFormArgs<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
> = {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
};
export type UseApiFormReturn<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
> = {
  form: UseFormReturn<Data>;
  submitHandler: (
    onSubmitProps: ApiEndpointProps<Params, QueryParams, Data>
  ) => Promise<Return>;
};
export function useApiForm<
  Schema extends ZodObject<ZodRawShape>,
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
>(
  args: UseApiFormArgs<Params, QueryParams, Data, Return> & {
    schema: Schema;
  }
): UseApiFormReturn<Params, QueryParams, Data, Return> {
  const { endpoint, schema } = args;
  const apiCall = useApiCall(endpoint);

  const form = useForm<Data>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });
  const submitHandler: (
    props: ApiEndpointProps<Params, QueryParams, Data>
  ) => Promise<ReturnType<typeof endpoint>> = async (
    props: ApiEndpointProps<Params, QueryParams, Data>
  ) => {
    try {
      return await apiCall(props);
    } catch (e) {
      handleFormApiErrors<Schema, Data>(e, schema, form.setError);
      throw e;
    }
  };

  return { form, submitHandler };
}
