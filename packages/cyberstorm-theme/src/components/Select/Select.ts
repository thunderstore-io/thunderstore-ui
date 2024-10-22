// SELECT ROOT
// Variants
export const SelectVariantsList = ["default"] as const;
export type SelectVariants = "default";

// Sizes
export const SelectSizesList = ["medium"] as const;
export type SelectSizes = "medium";

// Modifiers
export const SelectModifiersList = ["disabled"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type SelectModifiers = typeof SelectModifiersList[number];
