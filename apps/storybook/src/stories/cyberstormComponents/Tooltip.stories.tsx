import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { Tooltip, NewButton } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { content: "Tooltip content", side: "top" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args} open>
      <NewButton>Hover me</NewButton>
    </Tooltip>
  ),
};
