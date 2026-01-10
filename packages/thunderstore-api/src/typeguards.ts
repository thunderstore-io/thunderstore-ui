export const isNumberArray = (arr: unknown): arr is number[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "number" && !isNaN(s));

export const isRecord = (rec: unknown): rec is Record<string, unknown> =>
  typeof rec === "object" && rec !== null && !Array.isArray(rec);

export const isStringArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "string");
