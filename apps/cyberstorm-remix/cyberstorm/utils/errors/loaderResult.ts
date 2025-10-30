import { handleLoaderError } from "./handleLoaderError";
import { resolveRouteErrorPayload } from "./resolveRouteErrorPayload";

export type ResolveLoaderPromiseOptions = Parameters<
  typeof handleLoaderError
>[1];

export type LoaderErrorPayload = ReturnType<typeof resolveRouteErrorPayload>;

export type LoaderError = {
  readonly __error: LoaderErrorPayload;
};

export type LoaderResult<T> = T | LoaderError;

/**
 * Type guard that narrows a loader result to its error branch.
 */
export function isLoaderError<T>(value: LoaderResult<T>): value is LoaderError {
  return typeof (value as LoaderError)?.__error !== "undefined";
}

/**
 * Maps thrown loader values to the standard loader error payload wrapper.
 */
export function toLoaderError(error: unknown): LoaderError {
  return {
    __error: resolveRouteErrorPayload(error),
  };
}

/**
 * Resolves a loader promise and converts thrown errors into the standard loader error payload.
 */
export async function resolveLoaderPromise<T>(
  promise: Promise<T>,
  options?: ResolveLoaderPromiseOptions
): Promise<LoaderResult<T>> {
  try {
    return await promise;
  } catch (error) {
    try {
      handleLoaderError(error, options);
    } catch (thrown) {
      return toLoaderError(thrown);
    }

    return toLoaderError(error);
  }
}
