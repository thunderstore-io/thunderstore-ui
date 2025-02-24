import { useCallback } from "react";
import { z, ZodObject, ZodRawShape } from "zod";
import { ApiError, RequestConfig } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Schema extends ZodObject<Z>,
  ReturnSchema extends ZodObject<Z>,
  Meta extends object,
  Z extends ZodRawShape,
> {
  schema: Schema;
  returnSchema: ReturnSchema;
  endpoint: ApiEndpoint<z.infer<Schema>, Meta, ReturnSchema>;
  onSubmitSuccess?: (result: ReturnSchema) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
  config: () => RequestConfig;
}

export function ApiAction<
  Schema extends ZodObject<Z>,
  ReturnSchema extends ZodObject<Z>,
  Meta extends object,
  Z extends ZodRawShape,
>(props: ApiActionProps<Schema, ReturnSchema, Meta, Z>) {
  const { endpoint, onSubmitSuccess, onSubmitError, config } = props;
  const submitHandler = useApiAction({
    config,
    endpoint: endpoint,
  });
  const onSubmit = useCallback(
    async (data: z.infer<Schema>, meta: Meta) => {
      try {
        const result = await submitHandler(data, meta);
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

  return onSubmit;
}

ApiAction.displayName = "ApiAction";
