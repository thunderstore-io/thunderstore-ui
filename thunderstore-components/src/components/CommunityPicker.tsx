import React from "react";
import { Select, SelectOption } from "./Select";

const options: SelectOption[] = [
  { name: "Community 1", value: "community1" },
  { name: "Community 2", value: "community2" },
  { name: "Community 3", value: "community3" },
];

interface CommunityPickerProps {
  disabled?: boolean;
  name: string;
}

export const CommunityPicker = React.forwardRef<any, CommunityPickerProps>(
  ({ disabled = false, name }, ref) => {
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

CommunityPicker.displayName = "CommunityPicker";
