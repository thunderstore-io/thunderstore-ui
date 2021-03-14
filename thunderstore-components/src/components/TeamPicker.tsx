import { Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { Select, SelectOption } from "./Select";
import { ThunderstoreContext } from "./ThunderstoreProvider";

interface TeamPickerProps {
  disabled?: boolean;
  name: string;
}

export const TeamPicker = React.forwardRef<any, TeamPickerProps>(
  ({ disabled = false, name }, ref) => {
    const context = useContext(ThunderstoreContext);
    const { isLoading, data } = useQuery("userInfo", async () => {
      const r = await apiFetch(context, "/experimental/current-user/");
      return await r.json();
    });

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    if (!data) {
      return <Text>Failed to fetch</Text>;
    }

    const options: SelectOption[] = data.teams.map((teamName: string) => ({
      label: teamName,
      value: teamName,
    }));

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
