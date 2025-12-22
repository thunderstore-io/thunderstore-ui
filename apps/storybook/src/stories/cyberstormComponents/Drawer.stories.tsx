import type { Meta, StoryObj } from "@storybook/react-vite";

import { Drawer, NewButton } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  DrawerSizesList,
  DrawerVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: DrawerVariantsList },
    csSize: { control: "select", options: DrawerSizesList },
  },
  args: {},
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    popoverId: "drawer-1",
    trigger: (
      <NewButton popoverTarget="drawer-1" popoverTargetAction="show">
        Open drawer
      </NewButton>
    ),
  },
  render: (args) => (
    <Drawer {...args}>
      <div style={{ padding: 16 }}>Drawer content</div>
    </Drawer>
  ),
};
