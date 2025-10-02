import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewAlert } from "@thunderstore/cyberstorm";
import {
  AlertSizesList,
  AlertVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Alert",
  component: NewAlert,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: AlertVariantsList },
    csSize: { control: "select", options: AlertSizesList },
  },
  args: {
    csVariant: "info",
    csSize: AlertSizesList[0],
    children: <>This is an alert</>,
  },
} satisfies Meta<typeof NewAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const All: Story = {
  args: {},
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {AlertVariantsList.map((variant) => (
        <NewAlert key={variant} csVariant={variant}>
          This is an alert with variant: {variant}
        </NewAlert>
      ))}
    </div>
  ),
};
