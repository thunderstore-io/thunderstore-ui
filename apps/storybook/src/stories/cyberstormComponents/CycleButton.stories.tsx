import type { Meta, StoryObj } from "@storybook/react-vite";

import { CycleButton } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/CycleButton",
  component: CycleButton,
  tags: ["autodocs"],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof CycleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Cycle me",
    options: ["Newest", "Oldest", "Most downloaded"],
    onValueChange: (value: string) => console.log("CycleButton value:", value),
  },
};

export const Stateless: Story = {
  args: {
    children: "Click me",
    noState: true,
    onInteract: () => console.log("CycleButton interacted"),
  },
};
