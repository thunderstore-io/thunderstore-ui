import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextAreaInput } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/TextAreaInput",
  component: TextAreaInput,
  tags: ["autodocs"],
  args: { placeHolder: "Write something..." },
  render: (args) => (
    <div style={{ maxWidth: "400px" }}>
      <TextAreaInput {...args} />
    </div>
  ),
} satisfies Meta<typeof TextAreaInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };
export const WithValue: Story = { args: { value: "Some text..." } };
