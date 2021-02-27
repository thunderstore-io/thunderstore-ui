import React from "react";
import { Select, SelectOption } from "./Select";

const options: SelectOption[] = [
  { name: "Category name 1", value: "category-slug-1" },
  { name: "Category name 2", value: "category-slug-2" },
  { name: "Category name 3", value: "category-slug-3" },
];

interface CategoryPickerProps {
  disabled?: boolean;
  name: string;
}

export const CategoryPicker = React.forwardRef<any, CategoryPickerProps>(
  ({ disabled = false, name }, ref) => {
    return (
      <Select
        options={options}
        search={true}
        disabled={disabled}
        ref={ref}
        name={name}
      />
    );
  }
);

CategoryPicker.displayName = "CategoryPicker";
