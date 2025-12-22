import { ApiEndpointProps } from "@thunderstore/thunderstore-api";
import { ApiEndpoint, useApiCall } from "@thunderstore/ts-api-react";

export type UseApiActionArgs<Params, QueryParams, Data, Return> = {
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>;
};

export function useApiAction<Params, QueryParams, Data, Return>(
  args: UseApiActionArgs<Params, QueryParams, Data, Return>
) {
  const apiCall = useApiCall<Params, QueryParams, Data, Return>(args.endpoint);

  const submitHandler = async (
    props: ApiEndpointProps<Params, QueryParams, Data>
  ) => {
    return await apiCall(props);
  };

  return submitHandler;
}
