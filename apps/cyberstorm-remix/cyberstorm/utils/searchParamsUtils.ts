export function setParamsBlobValue<
  SearchParamsType,
  K extends keyof SearchParamsType,
>(setter: (v: SearchParamsType) => void, oldBlob: SearchParamsType, key: K) {
  return (v: SearchParamsType[K]) => setter({ ...oldBlob, [key]: v });
}

/**
 * A raw `page` query-param value coerced to a valid 1-based page number, or
 * undefined when it is absent or not a plain run of digits within safe-integer
 * range — so `?page=abc`, `?page=1abc`, `?page=1e3`, `?page=0x10`, `?page=-1`,
 * `?page=0`, and oversized values are all rejected (a lenient parseInt would
 * turn "1abc" into 1). Listing loaders pass the result straight to the API,
 * where undefined omits the param (page 1); without it a bad value reached the
 * API and turned a would-be 400 into an unhandled SSR 500.
 */
export function parsePageParam(raw: string | null): number | undefined {
  const token = raw?.trim() ?? "";
  if (!/^\d+$/.test(token)) return undefined;
  const page = Number(token);
  return Number.isSafeInteger(page) && page >= 1 ? page : undefined;
}
