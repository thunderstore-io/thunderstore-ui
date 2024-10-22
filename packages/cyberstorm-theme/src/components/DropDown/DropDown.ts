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
