import { StoryFn, Meta } from "@storybook/react";
import { Button, Dialog } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/Dialog",
  component: Dialog,
} as Meta;

const defaultArgs = {
  trigger: <Button label="trigger" />,
  title: "This is a dialog",
  content: (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "var(--color-text--default)",
      }}
    >
      Some content
    </div>
  ),
};

const Template: StoryFn<typeof Dialog> = (args) => <Dialog {...args} />;

const ReferenceDialog = Template.bind({});
ReferenceDialog.args = defaultArgs;

export { ReferenceDialog };
