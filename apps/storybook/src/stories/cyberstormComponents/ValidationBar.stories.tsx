import type { Meta, StoryObj } from "@storybook/react-vite";

import { ValidationBar } from "@thunderstore/cyberstorm";

import "./ValidationBar.css";

const meta = {
  title: "Cyberstorm/ValidationBar (legacy)",
  component: ValidationBar,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["waiting", "processing", "success", "failure"],
    },
    message: { control: "text" },
  },
  args: { status: "waiting", message: "Waiting for input" },
} satisfies Meta<typeof ValidationBar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };

export const Variants: Story = {
  render: () => (
    <>
      <ValidationBar status="waiting" message="Waiting for input" />
      {/* We can't disable the spinning icon because of css modules, so disable this for now */}
      {/* <ValidationBar status="processing" message="Processing..." /> */}
      <ValidationBar status="success" message="Success!" />
      <ValidationBar status="failure" message="Failure!" />
    </>
  ),
};
