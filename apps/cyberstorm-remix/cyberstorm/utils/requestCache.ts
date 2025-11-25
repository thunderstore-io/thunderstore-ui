import isEqual from "lodash/isEqual";

const restrictedNames = new Set(["", "anonymous", "default"]);

type CacheEntry = {
  funcName: string;
  inputs: unknown[];
  promise: Promise<unknown>;
};

const requestScopedCaches = new WeakMap<Request, CacheEntry[]>();
function getCache(request: Request) {
  let cache = requestScopedCaches.get(request);
  if (!cache) {
    cache = [];
    requestScopedCaches.set(request, cache);

    const signal = request.signal;
    if (signal) {
      if (signal.aborted) {
        cache.splice(0, cache.length);
      } else {
        signal.addEventListener(
          "abort",
          () => {
            cache?.splice(0, cache.length);
          },
          { once: true }
        );
      }
    }
  }

  if (request.signal?.aborted) {
    cache.splice(0, cache.length);
  }

  return cache;
}

export function getCachedRequestPromise<Args extends unknown[], Result>(
  funcName: string,
  func: (...inputs: Args) => Promise<Result>,
  inputs: Args,
  request: Request
): Promise<Result> {
  if (restrictedNames.has(funcName)) {
    throw new Error("Must be named functions to support caching.");
  }

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
  cache.push({
    funcName: funcName,
    inputs,
    promise,
  });

  return promise;
}
