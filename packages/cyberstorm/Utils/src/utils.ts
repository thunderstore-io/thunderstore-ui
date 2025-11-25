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

// TODO: FIX: Adds a empty space at the end when last item is undefined
export const classnames = (
  ...classnames: (string | null | undefined)[]
): string => {
  return classnames.filter(String).join(" ");
};

export const componentClasses = (
  namespace: string,
  variant?: string,
  size?: string,
  modifiers?: string[]
): string[] => {
  const listOfClasses = [];
  if (variant) {
    listOfClasses.push(`${namespace}--variant--${variant}`);
  }
  if (size) {
    listOfClasses.push(`${namespace}--size--${size}`);
  }
  if (modifiers) {
    listOfClasses.push(
      ...modifiers.map((csm) => (csm !== "" ? `${namespace}--${csm}` : ""))
    );
  }
  return listOfClasses;
};

export const formatToDisplayName = (name: string) =>
  name.replaceAll("-", " ").replaceAll("_", " ");
