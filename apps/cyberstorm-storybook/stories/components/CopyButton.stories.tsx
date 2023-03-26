import { StoryFn, Meta } from "@storybook/react";
import { CopyButton } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/CopyButton",
  component: CopyButton,
} as Meta;

const Template: StoryFn<typeof CopyButton> = () => (
  <CopyButton
    text="According to all known laws
of aviation, there is no way a bee
should be able to fly.
Its wings are too small to get
its fat little body off the ground.
The bee, of course, flies anyway
because bees don't care
what humans think is impossible.
"
  />
);

const DefaultCopyButton = Template.bind({});

export { DefaultCopyButton };
