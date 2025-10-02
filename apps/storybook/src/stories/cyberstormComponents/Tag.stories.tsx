import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewTag } from "@thunderstore/cyberstorm";
import {
  TagModifiersList,
  TagSizesList,
  TagVariantsList,
} from "@thunderstore/cyberstorm-theme/src/components";

const modes = ["tag", "button", "link"] as const;

const meta = {
  title: "Cyberstorm/Tag",
  component: NewTag,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: TagVariantsList },
    csSize: { control: "select", options: TagSizesList },
    csModifiers: { control: "multi-select", options: TagModifiersList },
    csMode: { control: "select", options: modes },
    href: { control: "text" },
  },
  args: { children: "SkibidiToilet", csMode: "tag" },
} satisfies Meta<typeof NewTag>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };

export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {TagVariantsList.map((variant) => (
        <NewTag {...args} key={variant} csVariant={variant}>
          {variant}
        </NewTag>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {TagSizesList.map((size) => (
        <NewTag {...args} key={size} csSize={size}>
          {size}
        </NewTag>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {TagModifiersList.map((modifier) => (
        <NewTag {...args} key={modifier} csModifiers={[modifier]}>
          {modifier}
        </NewTag>
      ))}
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <NewTag csMode={"tag"}>Tag</NewTag>
      <NewTag csMode={"button"}>Button</NewTag>
      <NewTag csMode={"link"} href="#">
        Link
      </NewTag>
    </div>
  ),
};
