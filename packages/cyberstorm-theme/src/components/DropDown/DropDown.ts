// DROPDOWN ROOT
// Variants
export const DropDownVariantsList = ["primary"] as const;
export type DropDownVariants = "primary";

// Sizes
export const DropDownSizesList = ["medium"] as const;
export type DropDownSizes = "medium";

// Modifiers
export const DropDownModifiersList = ["disabled", "subtle", "dimmed"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownModifiers = typeof DropDownModifiersList[number];

// DROPDOWN ITEM
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

// DROPDOWN DIVIDER
// Variants
export const DropDownDividerVariantsList = ["primary"] as const;
export type DropDownDividerVariants = "primary";

// Sizes
export const DropDownDividerSizesList = ["medium"] as const;
export type DropDownDividerSizes = "medium";

// Modifiers
export const DropDownDividerModifiersList = ["subtle", "dimmed"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type DropDownDividerModifiers = typeof DropDownDividerModifiersList[number];
