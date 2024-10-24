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
