import {
  ApiEndpointProps,
  MapUserFacingErrorOptions,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

export type ApiEndpoint<Params, QueryParams, Data, Return> = (
  props: ApiEndpointProps<Params, QueryParams, Data>
) => Return;

export type UseApiCallOptions = {
  mapErrors?: boolean;
  errorOptions?: MapUserFacingErrorOptions;
};

export function useApiCall<Params, QueryParams, Data, Return>(
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>,
  options: UseApiCallOptions = {}
): (props: ApiEndpointProps<Params, QueryParams, Data>) => Return {
  const shouldMapErrors = options.mapErrors ?? true;

  return (props: ApiEndpointProps<Params, QueryParams, Data>) => {
    try {
      const result = endpoint(props);

      if (!shouldMapErrors) {
        return result;
      }

      if (isPromise(result)) {
        return result.catch((error) => {
          throw mapApiErrorToUserFacingError(error, options.errorOptions);
        }) as Return;
      }

      return result;
    } catch (error) {
      if (!shouldMapErrors) {
        throw error;
      }
      throw mapApiErrorToUserFacingError(error, options.errorOptions);
    }
  };
}

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Promise<unknown>).then === "function"
  );
}
