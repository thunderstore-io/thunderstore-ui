export const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const formatInteger = (inputNumber: number) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(inputNumber);
};

export const classnames = (...classnames: (string | undefined)[]): string => {
  return classnames.filter(String).join(" ");
};
