// Variants
export const ToastVariantsList = [
  "info",
  "success",
  "warning",
  "danger",
] as const;
export type ToastVariants = "info" | "success" | "warning" | "danger";

// Sizes
export const ToastSizesList = ["medium"] as const;
export type ToastSizes = "medium";
