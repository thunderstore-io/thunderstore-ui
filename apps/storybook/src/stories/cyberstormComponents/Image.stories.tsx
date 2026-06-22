import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ComponentProps } from "react";

import { Image } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { ImageVariantsList } from "@thunderstore/cyberstorm-theme/src/components";
import { faBan, faGamepad } from "@thunderstore/icons";

import catHeim from "../assets/catheim.png";

const fallbackIconByKey = {
  gamepad: faGamepad,
  ban: faBan,
} as const;

const fallbackIconOptions = Object.keys(
  fallbackIconByKey
) as (keyof typeof fallbackIconByKey)[];

type ImageStoryArgs = Omit<ComponentProps<typeof Image>, "fallbackIcon"> & {
  fallbackIcon: keyof typeof fallbackIconByKey;
};

function toImageProps(args: ImageStoryArgs): ComponentProps<typeof Image> {
  const { fallbackIcon, ...rest } = args;
  return { ...rest, fallbackIcon: fallbackIconByKey[fallbackIcon] };
}

function ImageStory(args: ImageStoryArgs) {
  return <Image {...toImageProps(args)} />;
}

function renderImage(args: ImageStoryArgs, style: CSSProperties) {
  return (
    <div style={style}>
      <ImageStory {...args} />
    </div>
  );
}

const meta = {
  title: "Cyberstorm/Image",
  component: ImageStory,
  tags: ["autodocs"],
  argTypes: {
    csVariant: { control: "select", options: ImageVariantsList },
    fallbackIcon: {
      control: "select",
      options: fallbackIconOptions,
    },
    src: { control: "text" },
    alt: { control: "text" },
    square: { control: "boolean" },
  },
  args: {
    src: null,
    fallbackIcon: "gamepad",
    intrinsicWidth: 150,
    intrinsicHeight: 200,
  },
  render: (args) => renderImage(args, { width: "300px", height: "400px" }),
} satisfies Meta<typeof ImageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithImageAsset: Story = {
  args: { src: catHeim, alt: "catHeim", fallbackIcon: "gamepad" },
  render: (args) => renderImage(args, { width: "150px", height: "200px" }),
};

export const CommunityFallback: Story = {
  args: { alt: "Community", fallbackIcon: "gamepad" },
  render: (args) => renderImage(args, { width: "150px", height: "200px" }),
};

export const Package: Story = {
  args: { alt: "Package", fallbackIcon: "ban" },
  render: (args) => renderImage(args, { width: "150px", height: "200px" }),
};
