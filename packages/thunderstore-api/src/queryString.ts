import { isNumberArray, isStringArray } from "./typeguards";

type QueryStringable = string | number | boolean | string[] | number[];

interface QsItem<T extends QueryStringable> {
  key: string;
  value?: T;
  impotent?: T;
}

interface DefinedQsItem<T extends QueryStringable> extends QsItem<T> {
  value: T;
}

export type QsArray = (
  | QsItem<string>
  | QsItem<number>
  | QsItem<boolean>
  | QsItem<string[]>
  | QsItem<number[]>
)[];

/**
 * Create a cache-friendly query string from received objects.
 *
 * To increase the likelyhood of cache hits
 * * Empty values are filtered out.
 * * Impotent values are filtered out. Impotent values are ones that
 *   would have no effect on the resulting response if submitted to
 *   backend, e.g. default values.
 * * Parameter keys and values are sorted alphabetically.
 *
 * Accepts an array of objects containing the following fields, where
 * `T = string | number | boolean | string[] | number[]`:
 * * `key` (string): query string parameter name
 * * `value?` (T): query string parameter value
 * * `impotent?` (T): impotent value for this query string parameter
 */
export const serializeQueryString = (allParams: QsArray): string => {
  const keys = allParams.map((p) => encodeURIComponent(p.key));

  if (keys.length != new Set(keys).size) {
    throw new Error("Duplicate keys are not allowed. Use value array instead.");
  }

  return (
    _filterEmptyAndImpotent(allParams)
      // Sort parameters by keys to improve chances of cache hits.
      .sort((a, b) => a.key.localeCompare(b.key))
      // _toQueryParam() also sorts parameter values alphabetically.
      .map((item) => _toQueryParam(item.key, item.value))
      .join("&")
  );
};

/** Return true if arrays contain same items (ignoring the ordering). */
export function arraysAreEqual(strings1: string[], strings2: string[]): boolean;
export function arraysAreEqual(numbers1: number[], numbers2: number[]): boolean;
export function arraysAreEqual<T>(array1: T[], array2: T[]): boolean {
  const a = [...array1].sort();
  const b = [...array2].sort();
  return JSON.stringify(a) === JSON.stringify(b);
}

const _filterEmptyAndImpotent = (
  params: QsArray
): DefinedQsItem<QueryStringable>[] =>
  params.filter((item) => {
    if (Array.isArray(item.value)) {
      if (item.value.length === 0) {
        return false;
      } else if (item.impotent === undefined) {
        return true;
      } else if (!Array.isArray(item.impotent)) {
        throw new Error(
          "Impotent value must be either array or undefined for array values"
        );
      } else if (item.impotent.length === 0) {
        return true;
      } else if (isNumberArray(item.value) && isNumberArray(item.impotent)) {
        return !arraysAreEqual(item.value, item.impotent);
      } else if (isStringArray(item.value) && isStringArray(item.impotent)) {
        return !arraysAreEqual(item.value, item.impotent);
      }

      throw new Error("Value and impotent arrays must contain same types");
    }

    return ![undefined, "", item.impotent].includes(item.value);
  }) as DefinedQsItem<QueryStringable>[];

const _toQueryParam = (
  key: QsItem<QueryStringable>["key"],
  value: NonNullable<QsItem<QueryStringable>["value"]>
): string => {
  if (Array.isArray(value)) {
    let sorted: string[] | number[] = [];

    if (isStringArray(value)) {
      sorted = [...value].sort();
    } else if (isNumberArray(value)) {
      sorted = [...value].sort((a, b) => a - b);
    }

    return sorted.map((v) => _toQueryParam(key, v)).join("&");
  }

  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};
