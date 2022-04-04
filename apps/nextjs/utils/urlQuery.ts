/**
 * Helpers for accessing values in context object of getServerSideProps.
 *
 * Next.js provides access to query params via context object, which
 * contains the values as strings or string arrays. These helpers aim to
 * reduce repetition in pages by returning the values in expected type.
 */

export type UrlQuery = string | string[] | undefined;

/** Try returning the first query value, cast from a string to a boolean. */
export const getBoolean = (val: UrlQuery): boolean | undefined => {
  const stringVal = getString(val);

  switch (stringVal?.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
};

/** Try returning the first query value, cast from a string to an integer. */
export const getNumber = (val: UrlQuery): number | undefined => {
  const stringVal = getString(val);

  if (stringVal === undefined || !_isNonNegativeInt(stringVal)) {
    return undefined;
  }

  return parseInt(stringVal, 10);
};

/** Try returning the first query value. */
export const getString = (val: UrlQuery): string | undefined =>
  Array.isArray(val) ? val[0] : val;

/** Try returning the query value as an array regardless of the number of values. */
export const getStringArray = (val: UrlQuery): string[] | undefined => {
  if (Array.isArray(val)) {
    return val;
  }

  return val === undefined ? undefined : [val];
};

export const _isNonNegativeInt = (val: string): boolean => /^\d+$/.test(val);
