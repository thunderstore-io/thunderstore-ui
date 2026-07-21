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

// Comfortably above the largest real community (lethal-company has 31
// categories) while bounding what an arbitrary URL can push into the listing
// API's `IN` clause: a header-limit-sized query string otherwise packs a few
// thousand ids, and since each unique URL misses the CDN, every one of those
// reaches origin.
const MAX_LIST_PARAM_IDS = 100;

/**
 * The valid positive-integer ids for a repeatable list query param (e.g.
 * includedCategories), capped at MAX_LIST_PARAM_IDS. Gathers values across
 * EVERY occurrence of the key and across comma-separated values, validates each
 * as a positive integer, drops the invalid ones, and dedupes — returning
 * undefined when none are valid. So junk like `?includedCategories=abc` is
 * ignored instead of 500ing the listing API (which filters on the integer
 * category id), a mix like `?x=1,abc,2` keeps ["1","2"], and `?x=1&x=2`
 * combines to ["1","2"] rather than dropping the second occurrence.
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
        // Bail on the first id past the cap rather than parsing the whole
        // query string; the extras are silently dropped, as no legitimate
        // filter selection reaches this many.
        if (ids.size >= MAX_LIST_PARAM_IDS) return [...ids];
      }
    }
  }
  return ids.size > 0 ? [...ids] : undefined;
}

/**
 * A raw `search` query-param value with control characters stripped, or "" when
 * absent. A NUL (`?search=%00`) is forwarded to the API raw and comes straight
 * back as a 400 — bots probing for injection trigger this constantly — and no
 * control character is meaningful in a package search, so drop the whole
 * Unicode Cc category instead of special-casing NUL. Returns "" rather than
 * undefined because the loaders pass this straight to the API's `search`
 * argument, which expects a string.
 */
export function parseSearchParam(raw: string | null): string {
  return (raw ?? "").replace(/\p{Cc}/gu, "").trim();
}
