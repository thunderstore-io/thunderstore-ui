import React from "react";
import { Select, SelectOption } from "./Select";

const options: SelectOption[] = [
  { name: "Team1", value: "Team1" },
  { name: "Team2", value: "Team2" },
  { name: "Team3", value: "Team3" },
];

interface TeamPickerProps {
  disabled?: boolean;
  name: string;
}

export const TeamPicker = React.forwardRef<any, TeamPickerProps>(
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

TeamPicker.displayName = "TeamPicker";
