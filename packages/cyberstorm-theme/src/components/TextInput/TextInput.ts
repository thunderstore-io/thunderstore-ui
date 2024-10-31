// Variants
export const TextInputVariantsList = ["primary"] as const;
export type TextInputVariants = "primary";

// Sizes
export const TextInputSizesList = ["default", "textarea", "small"] as const;
export type TextInputSizes = "default" | "textarea" | "small";

// Modifiers
export const TextInputModifiersList = ["disabled", "ghost", "dimmed"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type TextInputModifiers = typeof TextInputModifiersList[number];
