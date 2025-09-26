import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { Menu, NewButton } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/Menu",
  component: Menu,
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    popoverId: "menu-1",
    trigger: (
      <NewButton popoverTarget="menu-1" popoverTargetAction="show">
        Open menu
      </NewButton>
    ),
  },
  render: (args) => (
    <Menu {...args}>
      <div style={{ padding: 8 }}>Menu content</div>
    </Menu>
  ),
};
