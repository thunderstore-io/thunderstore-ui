// Variants
export const BreadCrumbsVariantsList = ["default"] as const;
export type BreadCrumbsVariants = "default";

// Sizes
export const BreadCrumbsSizesList = ["medium"] as const;
export type BreadCrumbsSizes = "medium";

// Modifiers
export const BreadCrumbsModifiersList = ["dimmed"] as const;
// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type BreadCrumbsModifiers = typeof BreadCrumbsModifiersList[number];
