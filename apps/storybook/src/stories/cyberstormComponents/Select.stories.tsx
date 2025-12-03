import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewSelect } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  SelectModifiersList,
  SelectSizesList,
  SelectVariantsList,
} from "@thunderstore/cyberstorm-theme";

const meta = {
  title: "Cyberstorm/Select",
  component: NewSelect,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: SelectVariantsList },
    csSize: { control: "select", options: SelectSizesList },
    csModifiers: { control: "multi-select", options: SelectModifiersList },
    value: { control: "text" },
  },
  args: {
    options: [
      { value: "one", label: "One" },
      { value: "two", label: "Two" },
      { value: "three", label: "Three" },
    ],
    value: "one",
    placeholder: "Choose one",
    "aria-label": "Demo select",
    defaultOpen: true,
  },
} satisfies Meta<typeof NewSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Sizes: Story = {
  render: (args) => {
    const sizes = SelectSizesList.map((size) => (
      <div
        key={size}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>{size}</span>
        <NewSelect csSize={size} {...args} />
      </div>
    ));
    return <div style={{ display: "flex", gap: "1rem" }}>{sizes}</div>;
  },
};

export const Variants: Story = {
  render: (args) => {
    const variants = SelectVariantsList.map((variant) => (
      <div
        key={variant}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>{variant}</span>
        <NewSelect csVariant={variant} {...args} />
      </div>
    ));
    return <div style={{ display: "flex", gap: "1rem" }}>{variants}</div>;
  },
};

export const Modifiers: Story = {
  render: (args) => {
    const modifiers = SelectModifiersList.map((modifier) => (
      <div
        key={modifier}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>{modifier}</span>
        <NewSelect csModifiers={[modifier]} {...args} />
      </div>
    ));
    return <div style={{ display: "flex", gap: "1rem" }}>{modifiers}</div>;
  },
};
