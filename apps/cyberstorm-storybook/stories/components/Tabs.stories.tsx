import { StoryFn, Meta } from "@storybook/react";
import { Tabs } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

export default {
  title: "Cyberstorm/Components/Tabs",
  component: Tabs,
} as Meta;

const defaultArgs = {
  currentTab: 1,
  tabs: [
    { key: 1, label: "First tab" },
    { key: 2, label: "Second tab" },
    { key: 3, label: "Third tab" },
  ],
};

const Template: StoryFn<typeof Tabs> = (args) => {
  const [value, setValue] = useState(args.currentTab ? args.currentTab : 1);
  args.onTabChange = setValue;
  args.currentTab = value;

  return (
    <div>
      <Tabs {...args} />
      <div style={{ color: "white" }}>Value in state: {value}</div>
    </div>
  );
};

const ReferenceTabs = Template.bind({});
ReferenceTabs.args = defaultArgs;

export { ReferenceTabs };
