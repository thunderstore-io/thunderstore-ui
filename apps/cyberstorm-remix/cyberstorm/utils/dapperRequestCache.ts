import isEqual from "lodash/isEqual";

const restrictedNames = new Set(["", "anonymous", "default"]);

type CacheEntry = {
  funcName: string;
  inputs: unknown[];
  promise: Promise<unknown>;
};

const requestScopedCaches = new WeakMap<Request, CacheEntry[]>();
const globalFallbackCache: CacheEntry[] = [];

function getCache(request?: Request) {
  if (!request) {
    return globalFallbackCache;
  }

  let cache = requestScopedCaches.get(request);
  if (!cache) {
    cache = [];
    requestScopedCaches.set(request, cache);

    const signal = request.signal;
    if (signal && !signal.aborted) {
      signal.addEventListener(
        "abort",
        () => {
          cache?.splice(0, cache.length);
        },
        { once: true }
      );
    }
  }

  return cache;
}

export function getCachedDapperPromise<Args extends unknown[], Result>(
  method: (...inputs: Args) => Promise<Result>,
  inputs: Args,
  request?: Request,
  label?: string
): Promise<Result> {
  const methodLabel = label ?? method.name;

  if (restrictedNames.has(methodLabel)) {
    throw new Error(
      "Dapper methods must be named functions to support caching."
    );
  }

  const cache = getCache(request);
  for (const cacheEntry of cache) {
    if (
      cacheEntry.funcName === methodLabel &&
      isEqual(cacheEntry.inputs, inputs)
    ) {
      return cacheEntry.promise as Promise<Result>;
    }
  }

  const promise = method(...inputs) as Promise<Result>;
  cache.push({
    funcName: methodLabel,
    inputs,
    promise,
  });

  return promise;
}

export function clearGlobalDapperCache() {
  globalFallbackCache.splice(0, globalFallbackCache.length);
}
