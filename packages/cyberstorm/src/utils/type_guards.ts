export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

export const isStringArray = (arr: unknown): arr is string[] =>
  Array.isArray(arr) && arr.every((s) => typeof s === "string");

export const assertIsNode = (e: EventTarget | null): e is Node => {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
  return true;
};
