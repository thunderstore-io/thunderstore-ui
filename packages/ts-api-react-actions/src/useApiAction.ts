import { useCallback } from "react";

import { type ApiEndpointProps } from "@thunderstore/thunderstore-api";
import {
  type ApiEndpoint,
  type UseApiCallOptions,
  useApiCall,
} from "@thunderstore/ts-api-react";

export type UseApiActionArgs<Params, QueryParams, Data, Return> = {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
  apiCallOptions?: UseApiCallOptions;
};

/**
 * Hook that adapts `useApiCall` to an async submit handler suitable for form actions.
 */
export function useApiAction<Params, QueryParams, Data, Return>(
  args: UseApiActionArgs<Params, QueryParams, Data, Return>
): (
  props: ApiEndpointProps<Params, QueryParams, Data>
) => Promise<Awaited<Return>> {
  const apiCall = useApiCall<Params, QueryParams, Data, Return>(
    args.endpoint,
    args.apiCallOptions
  );

  const submitHandler = useCallback(
    async (
      props: ApiEndpointProps<Params, QueryParams, Data>
    ): Promise<Awaited<Return>> => {
      return await apiCall(props);
    },
    [apiCall, args]
  );

  return submitHandler;
}
