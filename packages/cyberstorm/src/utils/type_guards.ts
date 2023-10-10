export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

export const isStringArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "string");
