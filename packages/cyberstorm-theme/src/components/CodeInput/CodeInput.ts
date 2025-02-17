// Variants
export const CodeInputVariantsList = ["primary"] as const;
export type CodeInputVariants = "primary";

// Sizes
export const CodeInputSizesList = ["default"] as const;
export type CodeInputSizes = "default";

// Modifiers
export const CodeInputModifiersList = [
  "",
  "disabled",
  "valid",
  "invalid",
] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type CodeInputModifiers = typeof CodeInputModifiersList[number];
