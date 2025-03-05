// Variants
export const CardPackageVariantsList = [
  "card",
  "featured",
  "fullWidth",
  "secondary",
] as const;
export type CardPackageVariants =
  | "card"
  | "featured"
  | "fullWidth"
  | "secondary";

// Sizes
export const CardPackageSizesList = ["medium"] as const;
export type CardPackageSizes = "medium";

// Modifiers
export const CardPackageModifiersList = [] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type CardPackageModifiers = typeof CardPackageModifiersList[number];
