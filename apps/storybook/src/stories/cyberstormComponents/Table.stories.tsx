import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewTable } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  TableModifiersList,
  TableSizesList,
  TableVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Table",
  component: NewTable,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: TableVariantsList },
    csSize: { control: "select", options: TableSizesList },
    csModifiers: { control: "multi-select", options: TableModifiersList },
  },
  args: {
    headers: [
      { value: "Name", disableSort: false },
      { value: "Age", disableSort: true },
    ],
    rows: [
      [
        { value: "Bob", sortValue: "Bob" },
        { value: 25, sortValue: 25 },
      ],
      [
        { value: "Alice", sortValue: "Alice" },
        { value: 30, sortValue: 30 },
      ],
      [
        { value: "Charlie", sortValue: "Charlie" },
        { value: 35, sortValue: 35 },
      ],
    ],
    sortByHeader: 0,
  },
} satisfies Meta<typeof NewTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableVariantsList.map((variant) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={variant}
        >
          {variant}
          <NewTable key={variant} {...args} csVariant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableSizesList.map((size) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={size}
        >
          {size}
          <NewTable key={size} {...args} csSize={size} />
        </div>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableModifiersList.map((modifier) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={modifier}
        >
          {modifier}
          <NewTable key={modifier} {...args} csModifiers={[modifier]} />
        </div>
      ))}
    </div>
  ),
};
