import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardCommunity } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

import catHeim from "../assets/catheim.png";

const community = {
  name: "Valheim",
  identifier: "valheim",
  short_description:
    "A new survival and sandbox game for 1-10 players, set in a procedurally-generated purgatory inspired by Viking culture.",
  description:
    "A new survival and sandbox game for 1-10 players, set in a procedurally-generated purgatory inspired by Viking culture.",
  wiki_url: "#",
  discord_url: "#",
  datetime_created: "2021-02-02T12:00:00Z",
  hero_image_url: catHeim,
  cover_image_url: catHeim,
  icon_url: catHeim,
  community_icon_url: catHeim,
  total_package_count: 7823466782,
  total_download_count: 23457862358976,
};

const meta = {
  title: "Cyberstorm/CardCommunity",
  component: CardCommunity,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    isPopular: { control: "boolean" },
    isNew: { control: "boolean" },
    community: { control: "object" },
  },
  args: { community: community, isNew: true, isPopular: true },
  render: (args) => (
    <div style={{ width: "192px" }}>
      <CardCommunity {...args} />
    </div>
  ),
} satisfies Meta<typeof CardCommunity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
