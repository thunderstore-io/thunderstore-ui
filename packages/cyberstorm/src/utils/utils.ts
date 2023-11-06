export const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const formatInteger = (inputNumber: number) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(inputNumber);
};

export const classnames = (
  ...classnames: (string | null | undefined)[]
): string => {
  return classnames.filter(String).join(" ");
};

export const bankersRound = (n: number, d = 2) => {
  const x = n * Math.pow(10, d);
  const r = Math.round(x);
  const br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
  return br / Math.pow(10, d);
};
