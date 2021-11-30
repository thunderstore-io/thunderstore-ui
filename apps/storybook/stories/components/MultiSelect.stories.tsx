import { MultiSelect } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import * as SelectStories from "./Select.stories";

const meta = { component: MultiSelect } as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = (args) => (
  <MultiSelect {...args} />
);

const Multi = Template.bind({});
Multi.args = { ...SelectStories.Select.args };

export { meta as default, Multi as MultiSelect };
