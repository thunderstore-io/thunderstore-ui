import { Text } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { MultiSelect, MultiSelectProps, SelectOption } from "./Select";
import { ThunderstoreContext } from "./ThunderstoreProvider";

export interface Community {
  identifier: string;
  name: string;
  discord_url: string | null;
  wiki_url: string | null;
}

type CommunitySelectOption = SelectOption & {
  community: Community;
};

type MultiCommunityPickerProps = Pick<
  MultiSelectProps<CommunitySelectOption>,
  "disabled" | "onChange"
>;

export const MultiCommunityPicker: React.FC<MultiCommunityPickerProps> = ({
  disabled = false,
  onChange,
}) => {
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

  const options: CommunitySelectOption[] = data.results.map(
    (community: Community) => ({
      label: community.name,
      value: community.identifier,
      community: community,
    })
  );

  return (
    <MultiSelect options={options} disabled={disabled} onChange={onChange} />
  );
};
