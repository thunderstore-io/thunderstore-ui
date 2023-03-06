import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tabs } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Tabs",
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const defaultArgs = {
  currentTab: 1,
  tabs: [
    { key: 1, label: "First tab" },
    { key: 2, label: "Second tab" },
    { key: 3, label: "Third tab" },
  ],
};

const Template: ComponentStory<typeof Tabs> = (args) => {
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

export { meta as default, ReferenceTabs };
