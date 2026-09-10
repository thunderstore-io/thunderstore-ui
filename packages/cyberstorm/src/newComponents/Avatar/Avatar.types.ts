// Variants
export const AvatarVariantsList = ["default"] as const;
export type AvatarVariants = (typeof AvatarVariantsList)[number];

// Sizes
export const AvatarSizesList = [
  "verySmoll",
  "small",
  "medium",
  "large",
] as const;
export type AvatarSizes = (typeof AvatarSizesList)[number];
