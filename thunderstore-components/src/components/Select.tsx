import { Select as ChakraSelect } from "@chakra-ui/react";
import React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  options: SelectOption[];
  disabled?: boolean;
  multiSelect?: boolean;
  search?: boolean;
  name: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, disabled = false, name }, ref) => {
    return (
      <ChakraSelect disabled={disabled} ref={ref} name={name}>
        {options.map((option) => (
          <option key={`${option.label};${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </ChakraSelect>
    );
  }
);

Select.displayName = "Select";
