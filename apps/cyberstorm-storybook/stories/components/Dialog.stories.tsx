import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@thunderstore/cyberstorm";
import { Dialog } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Dialog",
  component: Dialog.Root,
} as Meta<typeof Dialog.Root>;

const defaultArgs = {
  title: "This is a dialog",
  trigger: (
    <Button.Root>
      <Button.ButtonLabel>trigger</Button.ButtonLabel>
    </Button.Root>
  ),
};

const Template: StoryFn<typeof Dialog.Root> = (args) => (
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
