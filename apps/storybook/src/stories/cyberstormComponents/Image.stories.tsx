import type { Meta, StoryObj } from "@storybook/react-vite";

import { Image } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { ImageVariantsList } from "@thunderstore/cyberstorm-theme/src/components";

import catHeim from "../assets/catheim.png";

const meta = {
  title: "Cyberstorm/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: ImageVariantsList },
    cardType: {
      control: "select",
      options: ["community", "communityIcon", "package"],
    },
    src: { control: "text" },
    alt: { control: "text" },
    square: { control: "boolean" },
  },
  args: { src: null, cardType: "community" },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: "300px", height: "400px" }}>
      <Image {...args} />
    </div>
  ),
};
export const WithImageAsset: Story = {
  args: { src: catHeim, alt: "catHeim", cardType: "community" },
  render: (args) => (
    <div style={{ width: "150px", height: "200px" }}>
      <Image {...args} />
    </div>
  ),
};
export const Community: Story = {
  args: { alt: "Community", cardType: "community" },
  render: (args) => (
    <div style={{ width: "150px", height: "200px" }}>
      <Image {...args} />
    </div>
  ),
};
export const CommunityIcon: Story = {
  args: { alt: "Community", cardType: "communityIcon" },
  render: (args) => (
    <div style={{ width: "150px", height: "200px" }}>
      <Image {...args} />
    </div>
  ),
};
export const Package: Story = {
  args: { alt: "Package", cardType: "package" },
  render: (args) => (
    <div style={{ width: "150px", height: "200px" }}>
      <Image {...args} />
    </div>
  ),
};
