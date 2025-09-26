import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewTextInput } from "@thunderstore/cyberstorm";
import {
  TextInputModifiersList,
  TextInputSizesList,
  TextInputVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/TextInput",
  component: NewTextInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: TextInputVariantsList },
    csSize: { control: "select", options: TextInputSizesList },
    csModifiers: { control: "multi-select", options: TextInputModifiersList },
    value: { control: "text" },
    placeholder: { control: "text" },
  },
  args: { value: "", placeholder: "Type here..." },
} satisfies Meta<typeof NewTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };

export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
      }}
    >
      {TextInputVariantsList.map((variant) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          key={variant}
        >
          {variant}
          <NewTextInput {...args} key={variant} csVariant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
      }}
    >
      {TextInputSizesList.map((size) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          key={size}
        >
          {size}
          <NewTextInput {...args} csSize={size} />
        </div>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
      }}
    >
      {TextInputModifiersList.map((modifier) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          key={modifier}
        >
          {modifier}
          <NewTextInput {...args} csModifiers={[modifier]} />
        </div>
      ))}
    </div>
  ),
};
