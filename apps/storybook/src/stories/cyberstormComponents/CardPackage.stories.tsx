import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardPackage } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

import type { PackageListing } from "../../../../../packages/dapper/src/types";
import goblin from "../assets/goblin.png";

const now = new Date("2023-01-01T00:00:00Z");
const modPackage = {
  community_identifier: "valheim",
  namespace: "Team",
  name: "cool-mod",
  description: "A cool mod",
  icon_url: goblin,
  download_count: 12345,
  rating_count: 678,
  categories: [
    { id: "ui", name: "UI", slug: "ui" },
    { id: "qol", name: "QoL", slug: "qol" },
  ],
  is_pinned: true,
  is_nsfw: true,
  is_deprecated: true,
  last_updated: now.toISOString(),
  size: 1234567,
  slug: "cool-mod",
} as PackageListing;

const meta = {
  title: "Cyberstorm/CardPackage",
  component: CardPackage,
  tags: ["autodocs"],
  argTypes: {
    isLiked: { control: "boolean" },
    packageData: { control: "object" },
  },
  args: {
    packageData: modPackage,
    isLiked: false,
  },
  render: (args) => (
    <div style={{ width: "224px" }}>
      <CardPackage {...args} />
    </div>
  ),
} satisfies Meta<typeof CardPackage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const IsLiked: Story = {
  args: { packageData: modPackage, isLiked: true },
};
