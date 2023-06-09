export const isDate = (value: string): boolean => {
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
};
