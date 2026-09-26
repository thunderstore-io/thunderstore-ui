import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "wide"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "default",
    children: (
      <div style={{ border: "1px dashed currentColor", padding: 16 }}>
        Container content — the container centres content and caps its width.
      </div>
    ),
  },
};

export const Wide: Story = {
  args: {
    size: "wide",
    children: (
      <div style={{ border: "1px dashed currentColor", padding: 16 }}>
        Wide container content.
      </div>
    ),
  },
};
