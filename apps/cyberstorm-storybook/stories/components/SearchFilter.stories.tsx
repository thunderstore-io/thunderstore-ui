import { StoryFn, Meta } from "@storybook/react";
import { SearchFilter } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/SearchFilter",
  component: SearchFilter,
} as Meta<typeof SearchFilter>;

const defaultArgs = {
  tags: [],
};

const Template: StoryFn<typeof SearchFilter> = (args) => (
  <SearchFilter {...args} />
);

const MinimalSearchFilter = Template.bind({});
MinimalSearchFilter.args = {
  ...defaultArgs,
};

const ReferenceSearchFilter = Template.bind({});
ReferenceSearchFilter.args = {
  tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
};

export { meta as default, MinimalSearchFilter, ReferenceSearchFilter };
