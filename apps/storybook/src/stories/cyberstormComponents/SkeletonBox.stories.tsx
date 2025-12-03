import type { Meta, StoryObj } from "@storybook/react-vite";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

import "./SkeletonBox.css";

const meta = {
  title: "Cyberstorm/SkeletonBox",
  component: SkeletonBox,
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonBox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="skeleton-box">
      <SkeletonBox />
    </div>
  ),
};
