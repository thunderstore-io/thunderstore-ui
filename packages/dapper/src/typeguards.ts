export const isNumberArray = (value: unknown): value is number[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.some((val) => typeof val !== "number" || isNaN(val))) {
    return false;
  }

  return true;
};

export const isStringArray = (value: unknown): value is string[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.some((val) => typeof val !== "string")) {
    return false;
  }

  return true;
};
