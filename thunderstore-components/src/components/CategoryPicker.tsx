import { Text } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { Select, SelectOption } from "./Select";
import { ThunderstoreContext } from "./ThunderstoreProvider";

interface Category {
  name: string;
  slug: string;
}

interface CategoryPickerProps {
  disabled?: boolean;
  name: string;
  communityIdentifier: string;
}

export const CategoryPicker = React.forwardRef<HTMLSelectElement, CategoryPickerProps>(
  ({ disabled = false, name, communityIdentifier }, ref) => {
    const context = useContext(ThunderstoreContext);
    const { isLoading, data } = useQuery(
      `categoryList-${communityIdentifier}`,
      async () => {
        const r = await apiFetch(
          context,
          `/experimental/community/${communityIdentifier}/category/`
        );
        return await r.json();
      }
    );

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    if (!data) {
      return <Text>Failed to fetch</Text>;
    }

    const options: SelectOption[] = data.packageCategories.map(
      (category: Category) => ({
        label: category.name,
        value: category.slug,
      })
    );

    return (
      <Select
        options={options}
        search={true}
        multiSelect={true}
        disabled={disabled}
        ref={ref}
        name={name}
      />
    );
  }
);

CategoryPicker.displayName = "CategoryPicker";
