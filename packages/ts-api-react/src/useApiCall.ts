import {
  type ApiEndpointProps,
  MapUserFacingErrorOptions,
  mapApiErrorToUserFacingError,
} from "@thunderstore/thunderstore-api";

/**
 * Describes an API endpoint invocation with typed params and data payload.
 */
export type ApiEndpoint<Params, QueryParams, Data, Return> = (
  props: ApiEndpointProps<Params, QueryParams, Data>
) => Return;

/**
 * Options that control automatic error mapping for `useApiCall`.
 */
export type UseApiCallOptions = {
  mapErrors?: boolean;
  errorOptions?: MapUserFacingErrorOptions;
};

/**
 * Wraps API endpoints to optionally map thrown errors into `UserFacingError` instances.
 */
export function useApiCall<Params, QueryParams, Data, Return>(
  endpoint: ApiEndpoint<Params, QueryParams, Data, Return>,
  options: UseApiCallOptions = {}
): (props: ApiEndpointProps<Params, QueryParams, Data>) => Return {
  const shouldMapErrors = options.mapErrors ?? true;

  return (props: ApiEndpointProps<Params, QueryParams, Data>) => {
    try {
      const result = endpoint(props);

      if (shouldMapErrors && isPromise(result)) {
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
