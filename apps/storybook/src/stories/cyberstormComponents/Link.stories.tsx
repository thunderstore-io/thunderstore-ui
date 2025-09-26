import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewLink } from "@thunderstore/cyberstorm";
import { LinkVariantsList } from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Link",
  component: NewLink,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    primitiveType: { control: "select", options: ["link"] },
    href: { control: "text" },
    csVariant: { control: "select", options: LinkVariantsList },
    disabled: { control: "boolean" },
  },
  args: {
    children: <>A link</>,
    href: "#",
    primitiveType: "link",
    csVariant: LinkVariantsList[0],
  },
} satisfies Meta<typeof NewLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Disabled: Story = { args: { disabled: true } };
