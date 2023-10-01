import { StoryFn, Meta } from "@storybook/react";
import { Button, Dialog } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Dialog",
  component: Dialog,
} as Meta<typeof Dialog>;

const defaultArgs = {
  trigger: (
    <Button.Root>
      <Button.Label>trigger</Button.Label>
    </Button.Root>
  ),
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

export { meta as default, ReferenceDialog };
