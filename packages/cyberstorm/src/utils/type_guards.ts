export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

export const isStringArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "string");

interface ErrorResponse {
  error: { message: string };
}

export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    isRecord(response) &&
    isRecord(response.error) &&
    typeof response.error.message === "string"
  );
}
