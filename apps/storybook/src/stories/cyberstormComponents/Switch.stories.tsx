import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewSwitch } from "@thunderstore/cyberstorm";
import {
  SwitchModifiersList,
  SwitchSizesList,
  SwitchVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Switch",
  component: NewSwitch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: SwitchVariantsList },
    csSize: { control: "select", options: SwitchSizesList },
    csModifiers: { control: "multi-select", options: SwitchModifiersList },
    value: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { value: false },
} satisfies Meta<typeof NewSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {SwitchVariantsList.map((variant) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={variant}
        >
          {variant}
          <NewSwitch key={variant} csVariant={variant} {...args} />
          <NewSwitch
            key={`${variant}-checked`}
            csVariant={variant}
            {...args}
            value={true}
          />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SwitchSizesList.map((size) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={size}
        >
          {size}
          <NewSwitch key={size} csSize={size} {...args} />
          <NewSwitch
            key={`${size}-checked`}
            csSize={size}
            {...args}
            value={true}
          />
        </div>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SwitchModifiersList.map((modifier) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={modifier}
        >
          {modifier}
          <NewSwitch key={modifier} csModifiers={[modifier]} {...args} />
          <NewSwitch
            key={`${modifier}-checked`}
            csModifiers={[modifier]}
            {...args}
            value={true}
          />
        </div>
      ))}
    </div>
  ),
};
