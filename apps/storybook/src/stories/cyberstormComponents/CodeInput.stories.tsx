import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeInput } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  CodeInputModifiersList,
  CodeInputSizesList,
  CodeInputVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

import "./CodeInput.css";

const meta = {
  title: "Cyberstorm/CodeInput",
  component: CodeInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: CodeInputVariantsList },
    csSize: { control: "select", options: CodeInputSizesList },
    csModifiers: { control: "multi-select", options: CodeInputModifiersList },
    value: { control: "text" },
    placeholder: { control: "text" },
    validationBarProps: { control: "object" },
  },
  args: {
    value: "",
    placeholder: "Code here...",
    validationBarProps: { status: "waiting" },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Value: Story = { args: { value: 'console.log("example log");' } };
export const Error: Story = {
  args: {
    validationBarProps: { status: "failure", message: "failure message" },
  },
};
export const Success: Story = {
  args: {
    validationBarProps: { status: "success", message: "Success message" },
  },
};
export const Warning: Story = {
  args: {
    validationBarProps: { status: "waiting", message: "Waiting message" },
  },
};
export const Info: Story = {
  args: {
    validationBarProps: { status: "processing", message: "Processing message" },
  },
};
export const Disabled: Story = { args: { csModifiers: ["disabled"] } };
export const Valid: Story = { args: { csModifiers: ["valid"] } };
export const Invalid: Story = { args: { csModifiers: ["invalid"] } };
