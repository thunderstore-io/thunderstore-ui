import { useCallback } from "react";
import { ApiEndpointProps, ApiError } from "@thunderstore/thunderstore-api";
import { ApiEndpoint } from "@thunderstore/ts-api-react";
import { useApiAction } from "./useApiAction";

export interface ApiActionProps<
  Params extends object,
  QueryParams extends object,
  Data extends object,
  Return,
> {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
  // params?: Params;
  // queryParams?: QueryParams;
  // data?: Data;
  onSubmitSuccess?: (result: Return) => void;
  onSubmitError?: (error: Error | ApiError | unknown) => void;
}

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
