// Variants
export const HeadingVariantsList = [
  "primary",
  "secondary",
  "tertiary",
  "accent",
] as const;
export type HeadingVariants = "primary" | "secondary" | "tertiary" | "accent";

// Sizes
export const HeadingSizesList = ["1", "2", "3", "4", "5", "6"] as const;
export type HeadingSizes = "1" | "2" | "3" | "4" | "5" | "6";

// Modifiers
export const HeadingModifiersList = ["subtle", "dimmed"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type HeadingModifiers = typeof HeadingModifiersList[number];
