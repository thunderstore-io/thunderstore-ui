import isEqual from "lodash/isEqual";

type CacheEntry = {
  funcName: string;
  inputs: unknown[];
  promise: Promise<unknown>;
};

const requestScopedCaches = new WeakMap<Request, CacheEntry[]>();

function getCache(request: Request) {
  if (request.signal?.aborted) {
    requestScopedCaches.delete(request);
    return [];
  }

  let cache = requestScopedCaches.get(request);
  if (!cache) {
    cache = [];
    requestScopedCaches.set(request, cache);

    const signal = request.signal;
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          requestScopedCaches.delete(request);
        },
        { once: true }
      );
    }
  }

  return cache;
}

/**
 * Deduplicates concurrent requests for the same function and arguments within the scope of a single Request.
 *
 * This is useful for clientLoaders where we have a Request that identifies a single navigation.
 *
 * This is the generic implementation that can be used directly, but most likely the developer wants to use
 * the function currently named `getDapperForRequest`.
 *
 * @remarks
 * This function uses `lodash/isEqual` for deep comparison of `inputs`.
 * - **Functions**: Compared by reference. Different instances of the same function logic will cause cache misses.
 * - **Circular References**: Supported by `isEqual` but can be computationally expensive.
 * - **Performance**: Deep comparison of large or deeply nested objects can be slow.
 *
 * @param funcName - The name of the function (used as part of the cache key).
 * @param func - The function to execute.
 * @param inputs - The arguments to pass to the function.
 * @param request - The Request object to scope the cache to.
 */
export function deduplicatePromiseForRequest<Args extends unknown[], Result>(
  funcName: string,
  func: (...inputs: Args) => Promise<Result>,
  inputs: Args,
  request: Request
): Promise<Result> {
  // Performance note: We use a linear search over the cache entries.
  // Since the number of unique requests per page load is usually small, this is acceptable.
  // We use lodash/isEqual for deep comparison of arguments.
  // CAUTION:
  // - Large objects can cause performance issues.
  // - Functions are compared by reference.
  // - Circular references are handled but expensive.
  const cache = getCache(request);
  for (const cacheEntry of cache) {
    if (
      cacheEntry.funcName === funcName &&
      isEqual(cacheEntry.inputs, inputs)
    ) {
      return cacheEntry.promise as Promise<Result>;
    }
  }

  const promise = func(...inputs) as Promise<Result>;

  const removeFromCache = (req: Request) => {
    const currentCache = getCache(req);
    const index = currentCache.findIndex((entry) => entry.promise === promise);
    if (index !== -1) {
      currentCache.splice(index, 1);
    }
  };

  // Remove from cache if it rejects to allow retrying
  promise.catch(() => removeFromCache(request));

  // Remove from cache after a timeout to prevent memory leaks from hanging promises
  // or unbounded growth in long-lived requests.
  const CACHE_TIMEOUT_MS = 60000;
  if (typeof WeakRef !== "undefined") {
    const requestRef = new WeakRef(request);
    setTimeout(() => {
      const req = requestRef.deref();
      if (req) {
        removeFromCache(req);
      }
    }, CACHE_TIMEOUT_MS);
  } else {
    setTimeout(() => removeFromCache(request), CACHE_TIMEOUT_MS);
  }

  cache.push({
    funcName,
    inputs,
    promise,
  });

  return promise;
}
