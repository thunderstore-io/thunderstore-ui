import { StoryFn, Meta } from "@storybook/react";
import { Button, Dialog } from "@thunderstore/cyberstorm";
import { DialogProps } from "@thunderstore/cyberstorm/src/components/Dialog/Dialog";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Dialog",
  component: Dialog.Root,
} as Meta<typeof Dialog>;

const defaultArgs = {
  title: "This is a dialog",
  trigger: (
    <Button.Root>
      <Button.ButtonLabel>trigger</Button.ButtonLabel>
    </Button.Root>
  ),
};

const Template: StoryFn<typeof Dialog.Root> = (args: DialogProps) => (
  <Dialog.Root {...args}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "var(--color-text--default)",
      }}
    >
      Some content
    </div>
  </Dialog.Root>
);

const ReferenceDialog = Template.bind({});
ReferenceDialog.args = defaultArgs;

export { meta as default, ReferenceDialog };
