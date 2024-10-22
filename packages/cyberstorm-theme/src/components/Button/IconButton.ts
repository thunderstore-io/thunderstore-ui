// Variants
export const IconButtonVariantsList = [
  "primary",
  "secondary",
  "tertiary",
  "minimal",
  "danger",
] as const;
export type IconButtonVariants =
  | "primary"
  | "secondary"
  | "tertiary"
  | "minimal"
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
