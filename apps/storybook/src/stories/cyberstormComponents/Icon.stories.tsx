import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewIcon } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { IconVariantsList } from "@thunderstore/cyberstorm-theme";

import "./Icon.css";

const meta = {
  title: "Cyberstorm/Icon",
  component: NewIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: IconVariantsList },
    csMode: { control: "select", options: ["inline", "block"] },
    noWrapper: { control: "boolean" },
  },
  args: {
    children: <FontAwesomeIcon icon={faStar} />,
    csVariant: IconVariantsList[3],
    csMode: "inline",
    noWrapper: false,
  },
  render: (args) => (
    <div className="icon">
      <NewIcon {...args} />
    </div>
  ),
} satisfies Meta<typeof NewIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const InlineAndNoWrapper: Story = {
  args: { noWrapper: true, csMode: "inline" },
};
export const ColorOverride: Story = {
  args: { noWrapper: true, csMode: "inline", csVariant: "primary" },
  render: (args) => (
    <div className="icon icon--red-color">
      <NewIcon {...args} />
    </div>
  ),
};
