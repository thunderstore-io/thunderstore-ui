import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewAvatar } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  AvatarSizesList,
  AvatarVariantsList,
} from "@thunderstore/cyberstorm-theme";

import catboy from "../assets/catboy.png";

const meta = {
  title: "Cyberstorm/Avatar",
  component: NewAvatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: AvatarVariantsList },
    csSize: { control: "select", options: AvatarSizesList },
  },
  args: {
    csVariant: AvatarVariantsList[0],
    csSize: AvatarSizesList[1],
    username: "username",
    src: null,
  },
} satisfies Meta<typeof NewAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
  args: { src: catboy, username: "CatBoy" },
};
