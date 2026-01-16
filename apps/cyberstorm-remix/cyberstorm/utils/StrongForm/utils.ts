export const isValueEmpty = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim() === "";
  }
  return value === undefined || value === null;
};
