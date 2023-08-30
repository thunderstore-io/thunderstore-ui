export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;
