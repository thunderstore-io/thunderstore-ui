import { StoryFn, Meta } from "@storybook/react";
import React, { useState } from "react";
import { SelectSearch } from "@thunderstore/cyberstorm/src/components/SelectSearch/SelectSearch";

const meta = {
  title: "Cyberstorm/Components/SelectSearch",
  component: SelectSearch,
} as Meta<typeof SelectSearch>;

const options = [
  "Team 1",
  "Team 2",
  "Team 3",
  "Team 4",
  "Team 5",
  "Team 6",
  "Team 7",
  "Team 8",
  "Team 9",
  "Team 10",
  "Team 11",
  "Team 12",
  "Team 13",
  "Team 14",
];

const defaultArgs = {
  placeholder: "Select something",
  options: options,
};

const Template: StoryFn<typeof SelectSearch> = (args) => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const defaultProps = {
    ...args,
    onChange: setSelected,
    value: selected,
  };
  return (
    <div>
      <div style={{ color: "white" }}>Value in state: {selected}</div>
      <SelectSearch {...defaultProps} />
    </div>
  );
};

const GreenSelectSearch = Template.bind({});
GreenSelectSearch.args = {
  ...defaultArgs,
  color: "green",
};

const RedSelectSearch = Template.bind({});
RedSelectSearch.args = {
  ...defaultArgs,
  color: "red",
};

export { meta as default, GreenSelectSearch, RedSelectSearch };
