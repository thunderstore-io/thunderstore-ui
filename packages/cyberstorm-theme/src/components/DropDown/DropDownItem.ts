// Variants
export const DropDownItemVariantsList = ["primary"] as const;
export type DropDownItemVariants = "primary";

// Sizes
export const DropDownItemSizesList = ["medium"] as const;
export type DropDownItemSizes = "medium";

// Modifiers
export const DropDownItemModifiersList = [
  "disabled",
  "subtle",
  "dimmed",
] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownItemModifiers = typeof DropDownItemModifiersList[number];
