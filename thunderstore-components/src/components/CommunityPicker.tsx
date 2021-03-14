import { Text } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { Select, SelectOption } from "./Select";
import { ThunderstoreContext } from "./ThunderstoreProvider";

interface Community {
  identifier: string;
  name: string;
  discord_url: string | null;
  wiki_url: string | null;
}

interface CommunityPickerProps {
  disabled?: boolean;
  name: string;
}

export const CommunityPicker = React.forwardRef<any, CommunityPickerProps>(
  ({ disabled = false, name }, ref) => {
    const context = useContext(ThunderstoreContext);
    const { isLoading, data } = useQuery("communityList", async () => {
      const r = await apiFetch(context, "/experimental/community/");
      return await r.json();
    });

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    if (!data) {
      return <Text>Failed to fetch</Text>;
    }

    const options: SelectOption[] = data.communities.map((community: Community) => ({
      label: community.name,
      value: community.identifier,
    }));

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
