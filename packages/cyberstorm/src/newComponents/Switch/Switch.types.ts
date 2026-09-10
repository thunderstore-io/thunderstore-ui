// Variants
export const SwitchVariantsList = ["default"] as const;
export type SwitchVariants = "default";

// Sizes
export const SwitchSizesList = ["small", "medium"] as const;
export type SwitchSizes = "small" | "medium";

// Modifiers
export const SwitchModifiersList = ["disabled"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type SwitchModifiers = typeof SwitchModifiersList[number];
