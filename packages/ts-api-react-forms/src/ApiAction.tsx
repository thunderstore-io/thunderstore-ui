"use client";

import { useCallback } from "react";
import { z, ZodObject, ZodRawShape } from "zod";
import { ApiError } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
> {
  schema: Schema;
  endpoint: ApiEndpoint<z.infer<Schema>, Result>;
  metaData: any;
  onSubmitSuccess?: (result: Result) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
}

export function ApiAction<
  Schema extends ZodObject<Z>,
  Result extends object,
  Z extends ZodRawShape
>(props: ApiActionProps<Schema, Result, Z>) {
  const { metaData, endpoint, onSubmitSuccess, onSubmitError } = props;
  const submitHandler = useApiAction({
    metaData: metaData,
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
