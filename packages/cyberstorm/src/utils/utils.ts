export const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const formatInteger = (
  inputNumber: number,
  notation: "standard" | "scientific" | "engineering" | "compact" = "compact"
) => {
  return Intl.NumberFormat("en", { notation: notation }).format(inputNumber);
};

export const numberWithSpaces = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatFileSize = (bytes: number) => {
  // NumberFormat with byte unit type, renders GBs as BBs "Billion bytes", so correct that mistake here.
  if (bytes > 999999999 && bytes < 1000000000000) {
    return `${(bytes / 1000000000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} GB`;
  }
  return Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  }).format(bytes);
};

export const classnames = (
  ...classnames: (string | null | undefined)[]
): string => {
  return classnames.filter(String).join(" ");
};
