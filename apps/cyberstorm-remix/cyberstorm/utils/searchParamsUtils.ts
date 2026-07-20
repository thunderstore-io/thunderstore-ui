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

/**
 * The valid positive-integer ids for a repeatable list query param (e.g.
 * includedCategories). Gathers values across EVERY occurrence of the key and
 * across comma-separated values, validates each as a positive integer, drops
 * the invalid ones, and dedupes — returning undefined when none are valid. So
 * junk like `?includedCategories=abc` is ignored instead of 500ing the listing
 * API (which filters on the integer category id), a mix like `?x=1,abc,2` keeps
 * ["1","2"], and `?x=1&x=2` combines to ["1","2"] rather than dropping the
 * second occurrence.
 */
export function parseIntListParam(
  searchParams: URLSearchParams,
  key: string
): string[] | undefined {
  const ids = new Set<string>();
  for (const raw of searchParams.getAll(key)) {
    for (const part of raw.split(",")) {
      const token = part.trim();
      // A plain run of digits within safe-integer range only: rejects
      // non-decimal ("0x10") and oversized values that String() would render in
      // scientific notation, consistent with parsePageParam.
      if (!/^\d+$/.test(token)) continue;
      const value = Number(token);
      if (Number.isSafeInteger(value) && value >= 1) {
        ids.add(String(value));
      }
    }
  }
  return ids.size > 0 ? [...ids] : undefined;
}
