// Variants
export const TagVariantsList = [
  "primary",
  "blue",
  "green",
  "yellow",
  "red",
  "pink",
  "orange",
  "purple",
] as const;
export type TagVariants =
  | "primary"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "pink"
  | "orange"
  | "purple";

// Sizes
export const TagSizesList = ["medium", "small", "xsmall"] as const;
export type TagSizes = "medium" | "small" | "xsmall";

// Modifiers
export const TagModifiersList = ["dark", "hoverable"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type TagModifiers = typeof TagModifiersList[number];
