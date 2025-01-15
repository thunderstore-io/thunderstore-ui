import { useCallback } from "react";
import { z, ZodObject, ZodRawShape } from "zod";
import { ApiError, RequestConfig } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
> {
  schema: Schema;
  endpoint: ApiEndpoint<RequestConfig, z.infer<Schema>, Meta, Result>;
  meta: Meta;
  onSubmitSuccess?: (result: Result) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
  config: RequestConfig;
}

export function ApiAction<
  Schema extends ZodObject<Z>,
  Meta extends object,
  Result extends object,
  Z extends ZodRawShape,
>(props: ApiActionProps<Schema, Meta, Result, Z>) {
  const { meta, endpoint, onSubmitSuccess, onSubmitError, config } = props;
  const submitHandler = useApiAction({
    config,
    meta: meta,
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

  return onSubmit;
}

ApiAction.displayName = "ApiAction";
