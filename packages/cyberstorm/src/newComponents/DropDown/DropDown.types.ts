// DROPDOWN ROOT
// Variants
export const DropDownVariantsList = ["primary"] as const;
export type DropDownVariants = "primary";

// Modifiers
export const DropDownModifiersList = [] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownModifiers = typeof DropDownModifiersList[number];

// DROPDOWN ITEM
// Variants
export const DropDownItemVariantsList = [
  "primary",
  "danger",
  "disabled",
] as const;
export type DropDownItemVariants = "primary" | "danger" | "disabled";

// Modifiers
export const DropDownItemModifiersList = [] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownItemModifiers = typeof DropDownItemModifiersList[number];

// DROPDOWN DIVIDER
// Modifiers
export const DropDownDividerModifiersList = [] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownDividerModifiers = typeof DropDownDividerModifiersList[number];
