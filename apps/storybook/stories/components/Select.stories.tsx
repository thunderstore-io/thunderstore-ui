import { Select } from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

const args = {
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  onChange: () => null,
};

export default { component: Select } as Meta;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

const Select_ = Template.bind({});
Select_.args = { ...args };

export { Select_ as Select };
