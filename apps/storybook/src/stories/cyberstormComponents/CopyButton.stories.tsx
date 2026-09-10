import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyButton } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Text copied to the clipboard",
  },
};
