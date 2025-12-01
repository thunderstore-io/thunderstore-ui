import { type ApiEndpointProps } from "@thunderstore/thunderstore-api";

export type ApiEndpoint<Params, QueryParams, Data, Return> = (
  props: ApiEndpointProps<Params, QueryParams, Data>
) => Return;

export function useApiCall<Params, QueryParams, Data, Return>(
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>
): (props: ApiEndpointProps<Params, QueryParams, Data>) => Return {
  return (props: ApiEndpointProps<Params, QueryParams, Data>) => {
    return endpoint(props);
  };
}
