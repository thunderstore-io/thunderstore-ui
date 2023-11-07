import { StoryFn, Meta } from "@storybook/react";
import { PackageCard } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/PackageCard",
  component: PackageCard,
} as Meta<typeof PackageCard>;

const style: React.CSSProperties = {
  padding: "3rem",
  flexWrap: "wrap",
  display: "grid",
  flexDirection: "row",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(15.5rem, 1fr))",
};

const Template: StoryFn<typeof PackageCard> = (args) => (
  <div style={style}>
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
  </div>
);

const ReferencePackageCard = Template.bind({});
ReferencePackageCard.args = {
  package: {
    name: "WaveTimer",
    namespace: "otDan",
    community_identifier: "brotato",
    description: "Modifies the in game timer to have a new look ",
    icon_url:
      "https://gcdn.thunderstore.io/live/repository/icons/otDan-WaveTimer-1.1.0.png.256x256_q95_crop.jpg",
    download_count: 2707,
    rating_count: 1,
    size: 106299,
    last_updated: "2023-02-28T11:23:42.000000Z",
    is_pinned: false,
    is_nsfw: false,
    is_deprecated: false,
    categories: [
      { id: 1, name: "Misc", slug: "misc" },
      { id: 2, name: "Mods", slug: "mods" },
    ],
  },
};

export { meta as default, ReferencePackageCard };
