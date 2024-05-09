/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Based on react-promise-suspense v0.3.4. Improves caching by comparing
 * the names of the functions passed to usePromise.
 */

// Changed for Thunderstore: use lodash instead of fast-deep-equal
import lodash from "lodash";
const { isEqual } = lodash;

interface PromiseCache {
  promise: Promise<void>;
  funcName: string; // Added for Thunderstore
  inputs: Array<any>;
  error?: any;
  response?: any;
}

const promiseCaches: PromiseCache[] = [];

export const usePromise = <Args extends any[], Result>(
  promise: (...inputs: Args) => Promise<Result>,
  inputs: Args,
  lifespan = 0
): Result => {
  // Added for Thunderstore
  if (["", "anonymous", "default"].includes(promise.name)) {
    throw new Error(
      "usePromise doesn't support nameless functions. See README for more info."
    );
  }

  // Cache Check
  for (const promiseCache of promiseCaches) {
    if (
      promise.name === promiseCache.funcName && // Added for Thunderstore: compare funcName
      isEqual(inputs, promiseCache.inputs)
    ) {
      // If an error occurred,
      if (Object.prototype.hasOwnProperty.call(promiseCache, "error")) {
        throw promiseCache.error;
      }

      // If a response was successful,
      else if (Object.prototype.hasOwnProperty.call(promiseCache, "response")) {
        return promiseCache.response;
      }
      throw promiseCache.promise;
    }
  }

  // The request is new or has changed.
  const promiseCache: PromiseCache = {
    promise:
      // Make the promise request.
      promise(...inputs)
        .then((response: Result) => {
          promiseCache.response = response;
        })
        .catch((e: Error) => {
          promiseCache.error = e;
        })
        .then(() => {
          if (lifespan > 0) {
            setTimeout(() => {
              const index = promiseCaches.indexOf(promiseCache);
              if (index !== -1) {
                promiseCaches.splice(index, 1);
              }
            }, lifespan);
          }
        }),
    funcName: promise.name, // Added for Thunderstore
    inputs,
  };

  promiseCaches.push(promiseCache);
  throw promiseCache.promise;
};
