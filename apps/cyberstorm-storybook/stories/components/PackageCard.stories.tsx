import { StoryFn, Meta } from "@storybook/react";
import { PackageCard } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/PackageCard",
  component: PackageCard,
} as Meta;

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
  packageData: {
    name: "WaveTimer",
    namespace: "otDan",
    community: "brotato",
    description: "Modifies the in game timer to have a new look ",
    imageSource:
      "https://gcdn.thunderstore.io/live/repository/icons/otDan-WaveTimer-1.1.0.png.256x256_q95_crop.jpg",
    downloadCount: 2707,
    likes: 1,
    size: 106299,
    author: "otDan",
    lastUpdated: "Tue Feb 28 2023",
    isPinned: false,
    isNsfw: false,
    isDeprecated: false,
    categories: [
      { name: "Misc", slug: "misc" },
      { name: "Mods", slug: "mods" },
    ],
  },
};

export { ReferencePackageCard };
