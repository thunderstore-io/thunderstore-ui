export const isNumberArray = (arr: unknown): arr is number[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "number" && !isNaN(s));

export const isStringArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "string");
