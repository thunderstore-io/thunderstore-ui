import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { AdContainer } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/AdContainer",
  component: AdContainer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { containerId: "ad-1" },
} satisfies Meta<typeof AdContainer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };
