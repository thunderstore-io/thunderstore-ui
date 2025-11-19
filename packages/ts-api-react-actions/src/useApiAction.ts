import { useCallback } from "react";
import {
  ApiEndpoint,
  UseApiCallOptions,
  useApiCall,
} from "@thunderstore/ts-api-react";
import { ApiEndpointProps } from "@thunderstore/thunderstore-api";

/**
 * Configuration for wiring `useApiAction` to a specific API endpoint.
 */
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
      const result = await apiCall(props);
      return result as Awaited<Return>;
    },
    [apiCall]
  );

  return submitHandler;
}
