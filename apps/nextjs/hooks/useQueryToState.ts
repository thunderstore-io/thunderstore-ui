import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UrlQueryValue = string | string[] | undefined;

/**
 * Read value from GET parameters and store it in React's state.
 *
 * The value and setter are returned, so the value can be used and
 * updated as needed. The idea is to initialize the value based on
 * current URL, e.g. read the initial search parameters.
 */
export function useQueryToState<T>(
  stateKey: string,
  castQueryToValueType: (value: UrlQueryValue) => T
): [T, Dispatch<SetStateAction<T>>];
export function useQueryToState<T>(
  stateKey: string,
  castQueryToValueType: (value: UrlQueryValue) => T[]
): [T[], Dispatch<SetStateAction<T[]>>] {
  const { query } = useRouter();
  const rawQueryParam = query[stateKey];
  const queryValue = castQueryToValueType(rawQueryParam);
  const [stateValue, setState] = useState(queryValue);

  useEffect(
    () => {
      if (Array.isArray(queryValue)) {
        if (
          queryValue.length !== stateValue.length ||
          queryValue.some((value, index) => value != stateValue[index])
        ) {
          setState(queryValue);
        }
      } else if (queryValue !== stateValue) {
        setState(queryValue);
      }
    },
    // Don't trigger update if stateValue changes due to user actions,
    // since that would cause an infinite loop.
    [rawQueryParam, setState]
  );

  return [stateValue, setState];
}

const strToBool = (value: string): boolean => value.toLowerCase() === "true";

const strToInt = (value: string): number => {
  const result = parseInt(value, 10);

  if (isNaN(result)) {
    return -1;
  }

  return result;
};

export const queryToBool = (query: UrlQueryValue): boolean => {
  if (query === undefined) {
    return false;
  }

  return Array.isArray(query) ? strToBool(query[0]) : strToBool(query);
};

export const queryToInt = (query: UrlQueryValue): number => {
  if (query === undefined) {
    return 0;
  }

  return Array.isArray(query) ? strToInt(query[0]) : strToInt(query);
};

export const queryToInts = (query: UrlQueryValue): number[] => {
  if (query === undefined) {
    return [];
  }

  return (Array.isArray(query) ? query : [query]).map(strToInt);
};

export const queryToStr = (query: UrlQueryValue): string => {
  if (query === undefined) {
    return "";
  }

  return Array.isArray(query) ? query[0] : query;
};

export const queryToStrs = (query: UrlQueryValue): string[] => {
  if (query === undefined) {
    return [];
  }

  return Array.isArray(query) ? query : [query];
};
