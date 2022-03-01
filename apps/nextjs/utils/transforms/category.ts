import { SelectOption } from "@thunderstore/components";

export interface Category {
  slug: string;
  name: string;
}

// Transform backend's PackageCategory to format suitable to select elements.
export const categoriesToSelectOptions = (
  categories: Category[]
): SelectOption[] => categories.map((c) => ({ value: c.slug, label: c.name }));
