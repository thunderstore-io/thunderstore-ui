// Variants
export const IconButtonVariantsList = [
  "primary",
  "secondary",
  "minimal",
  "accent",
  "special",
  "info",
  "success",
  "warning",
  "danger",
] as const;
export type IconButtonVariants =
  | "primary"
  | "secondary"
  | "minimal"
  | "accent"
  | "special"
  | "info"
  | "success"
  | "warning"
  | "danger";

// Sizes
export const IconButtonSizesList = ["medium", "small", "xsmall"] as const;
export type IconButtonSizes = "medium" | "small" | "xsmall";

// Modifiers
export const IconButtonModifiersList = [
  "disabled",
  "subtle",
  "dimmed",
] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type IconButtonModifiers = typeof IconButtonModifiersList[number];
