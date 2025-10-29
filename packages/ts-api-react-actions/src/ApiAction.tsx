import { useCallback } from "react";
import {
  ApiEndpointProps,
  UserFacingError,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";
import { ApiEndpoint, UseApiCallOptions } from "@thunderstore/ts-api-react";
import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
> {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
  apiCallOptions?: UseApiCallOptions;
  onSubmitSuccess?: (result: Awaited<Return>) => void;
  onSubmitError?: (error: UserFacingError) => void;
}

// As of this moment ApiActions sole purpose is to gracefully handle errors from API calls
export function ApiAction<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
>(props: ApiActionProps<Params, QueryParams, Data, Return>) {
  const { endpoint, onSubmitSuccess, onSubmitError, apiCallOptions } = props;
  const submitHandler = useApiAction<
    Params,
    QueryParams,
    Data,
    ReturnType<typeof endpoint>
  >({
    endpoint: endpoint,
    apiCallOptions,
  });
  const onSubmit = useCallback(
    async (onSubmitProps: ApiEndpointProps<Params, QueryParams, Data>) => {
      try {
        const result = await submitHandler(onSubmitProps);
        if (onSubmitSuccess) {
          onSubmitSuccess(result);
        }
      } catch (e) {
        const mappedError =
          e instanceof UserFacingError ? e : mapApiErrorToUserFacingError(e);

        if (onSubmitError) {
          onSubmitError(mappedError);
        } else {
          throw mappedError;
        }
      }
    },
    [onSubmitSuccess, onSubmitError, apiCallOptions, submitHandler]
  );

  return onSubmit;
}

ApiAction.displayName = "ApiAction";
