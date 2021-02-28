import { Select as ChakraSelect } from "@chakra-ui/react";
import React from "react";

export type SelectOption = {
  name: string;
  value: string;
};

interface SelectProps {
  options: SelectOption[];
  disabled?: boolean;
  multiSelect?: boolean;
  search?: boolean;
  name: string;
}

export const Select = React.forwardRef<any, SelectProps>(
  ({ options, disabled = false, name }, ref) => {
    return (
      <ChakraSelect disabled={disabled} ref={ref} name={name}>
        {options.map((option) => (
          <option key={`${option.name};${option.value}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </ChakraSelect>
    );
  }
);

Select.displayName = "Select";
