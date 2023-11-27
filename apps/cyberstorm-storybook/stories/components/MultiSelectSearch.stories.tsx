import { StoryFn, Meta } from "@storybook/react";
import React, { useState } from "react";
import { MultiSelectSearch } from "@thunderstore/cyberstorm/src/components/MultiSelectSearch/MultiSelectSearch";

const meta = {
  title: "Cyberstorm/Components/MultiSelectSearch",
  component: MultiSelectSearch,
} as Meta<typeof MultiSelectSearch>;

const options = [
  { label: "Team 1", value: "Team 1" },
  { label: "Team 2", value: "Team 2" },
  { label: "Team 3", value: "Team 3" },
  { label: "Team 4", value: "Team 4" },
  { label: "Team 5", value: "Team 5" },
  { label: "Team 6", value: "Team 6" },
  { label: "Team 7", value: "Team 7" },
  { label: "Team 8", value: "Team 8" },
  { label: "Team 9", value: "Team 9" },
  { label: "Team 10", value: "Team 10" },
  { label: "Team 11", value: "Team 11" },
  { label: "Team 12", value: "Team 12" },
  { label: "Team 13", value: "Team 13" },
  { label: "Team 14", value: "Team 14" },
];

const defaultArgs = {
  placeholder: "Select something",
  options: options,
};

const Template: StoryFn<typeof MultiSelectSearch> = (args) => {
  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    []
  );
  const defaultProps = {
    ...args,
    onChange: (x: { label: string; value: string }[]) => setSelected(x),
    value: selected,
  };
  return (
    <div>
      <div style={{ color: "white" }}>
        Value in state: {selected.map((s) => s.label).join(", ")}
      </div>
      <MultiSelectSearch {...defaultProps} />
    </div>
  );
};

const GreenMultiSelectSearch = Template.bind({});
GreenMultiSelectSearch.args = {
  ...defaultArgs,
  color: "green",
};

const RedMultiSelectSearch = Template.bind({});
RedMultiSelectSearch.args = {
  ...defaultArgs,
  color: "red",
};

export { meta as default, GreenMultiSelectSearch, RedMultiSelectSearch };
