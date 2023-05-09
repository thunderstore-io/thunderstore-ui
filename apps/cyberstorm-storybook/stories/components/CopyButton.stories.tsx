import { StoryFn, Meta } from "@storybook/react";
import { CopyButton } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/CopyButton",
  component: CopyButton,
} as Meta;

const defaultArgs = {
  text: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
};

const Template: StoryFn<typeof CopyButton> = (args) => (
  <div>
    <CopyButton {...args} />
  </div>
);

const DefaultCopyButton = Template.bind({});
DefaultCopyButton.args = defaultArgs;

export { DefaultCopyButton };
