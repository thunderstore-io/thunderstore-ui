export const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const formatInteger = (inputNumber: number) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(inputNumber);
};

export const strToHashInt = function (inputString: string) {
  return inputString
    ? inputString.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    : 0;
};
