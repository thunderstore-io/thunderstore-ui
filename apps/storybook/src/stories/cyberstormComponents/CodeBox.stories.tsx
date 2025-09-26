import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBox } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/CodeBox",
  component: CodeBox,
  tags: ["autodocs"],
  args: { value: "npm i @thunderstore/cyberstorm", inline: false },
} satisfies Meta<typeof CodeBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Inline: Story = { args: { inline: true } };
