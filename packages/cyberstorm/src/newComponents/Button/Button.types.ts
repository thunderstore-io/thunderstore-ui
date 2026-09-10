// Variants
export const ButtonVariantsList = [
  "primary",
  "secondary",
  "accent",
  "special",
  "info",
  "success",
  "warning",
  "danger",
] as const;
export type ButtonVariants =
  | "primary"
  | "secondary"
  | "accent"
  | "special"
  | "info"
  | "success"
  | "warning"
  | "danger";

// Sizes
export const ButtonSizesList = ["big", "medium", "small", "xsmall"] as const;
export type ButtonSizes = "big" | "medium" | "small" | "xsmall";

// Modifiers
export const ButtonModifiersList = ["disabled", "ghost", "only-icon"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type ButtonModifiers = typeof ButtonModifiersList[number];
