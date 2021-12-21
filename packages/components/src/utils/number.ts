/**
 * Number-related helper methods.
 */

/**
 * Format large numbers in a human-friendly way.
 *
 * E.g. 1234 will be shown as "1.2k" and 1000000 as "1M".
 */
export const formatCount = (value: number): string => {
  let result = value.toString();

  if (value > 999999) {
    result = `${(value / 1000000).toFixed(1)}M`;
  } else if (value > 999) {
    result = `${(value / 1000).toFixed(1)}k`;
  }

  return result.replace(".0", "");
};
