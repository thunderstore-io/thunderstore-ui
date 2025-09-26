import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { Heading } from "@thunderstore/cyberstorm";
import {
  HeadingVariantsList,
  HeadingSizesList,
  HeadingModifiersList,
} from "@thunderstore/cyberstorm-theme/src/components";

const meta = {
  title: "Cyberstorm/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    mode: { control: "select", options: ["heading", "display"] },
    csVariant: { control: "select", options: HeadingVariantsList },
    csSize: { control: "select", options: HeadingSizesList },
    csModifiers: { control: "multi-select", options: HeadingModifiersList },
    csLevel: { control: "select", options: ["1", "2", "3", "4", "5", "6"] },
  },
  args: { children: <>Heading</>, csLevel: "1", mode: "heading" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const Sizes: Story = {
  args: {},
  render: (args) => {
    const allHeadings = HeadingSizesList.map((size) => (
      <div key={size} style={{ marginBottom: "1rem" }}>
        <Heading {...args} csSize={size}>
          Heading {size}
        </Heading>
      </div>
    ));
    return <>{allHeadings}</>;
  },
};

export const Variants: Story = {
  args: {},
  render: (args) => {
    const allHeadings = HeadingVariantsList.map((variant) => (
      <div key={variant} style={{ marginBottom: "1rem" }}>
        <Heading {...args} csVariant={variant}>
          Heading {variant}
        </Heading>
      </div>
    ));
    return <>{allHeadings}</>;
  },
};

export const Levels: Story = {
  args: {},
  render: (args) => {
    const allHeadings = ["1", "2", "3", "4", "5", "6"].map((level) => (
      <div key={level} style={{ marginBottom: "1rem" }}>
        <Heading {...args} csLevel={level as "1" | "2" | "3" | "4" | "5" | "6"}>
          Heading {level}
        </Heading>
      </div>
    ));
    return <>{allHeadings}</>;
  },
};

export const Modifiers: Story = {
  args: {},
  render: (args) => {
    const allHeadings = HeadingModifiersList.map((modifier) => (
      <div key={modifier} style={{ marginBottom: "1rem" }}>
        <Heading {...args} csModifiers={[modifier]}>
          Heading {modifier}
        </Heading>
      </div>
    ));
    return <>{allHeadings}</>;
  },
};
