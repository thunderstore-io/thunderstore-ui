import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewMetaItem } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  MetaItemSizesList,
  MetaItemVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/MetaItem",
  component: NewMetaItem,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: MetaItemVariantsList },
    csSize: { control: "select", options: MetaItemSizesList },
  },
  args: { children: <>123</> },
} satisfies Meta<typeof NewMetaItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {MetaItemSizesList.map((size) => (
        <NewMetaItem key={size} csSize={size} {...args} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {MetaItemVariantsList.map((variant) => (
        <NewMetaItem key={variant} csVariant={variant} {...args} />
      ))}
    </div>
  ),
};
