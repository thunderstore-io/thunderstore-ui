import { useCallback } from "react";

import {
  type ApiEndpointProps,
  ApiError,
} from "@thunderstore/thunderstore-api";
import { type ApiEndpoint } from "@thunderstore/ts-api-react";

import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
> {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
  onSubmitSuccess?: (result: Awaited<Return>) => void;
  onSubmitError?: (error: Error | ApiError) => void;
}

// As of this moment ApiActions sole purpose is to gracefully handle errors from API calls
export function ApiAction<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
>(props: ApiActionProps<Params, QueryParams, Data, Return>) {
  const { endpoint, onSubmitSuccess, onSubmitError } = props;
  const submitHandler = useApiAction<
    Params,
    QueryParams,
    Data,
    ReturnType<typeof endpoint>
  >({
    endpoint: endpoint,
  });
  const onSubmit = useCallback(
    async (onSubmitProps: ApiEndpointProps<Params, QueryParams, Data>) => {
      try {
        const result = await submitHandler(onSubmitProps);
        if (onSubmitSuccess) {
          onSubmitSuccess(result);
        }
      } catch (e) {
        if (onSubmitError) {
          onSubmitError(e as Error | ApiError);
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
