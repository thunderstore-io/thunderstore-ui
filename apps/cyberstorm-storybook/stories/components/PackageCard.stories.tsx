import { StoryFn, Meta } from "@storybook/react";
import { PackageCard, PackagePreview } from "@thunderstore/cyberstorm";
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

const packageData: PackagePreview = {
  name: "MinisterAPI DeLuxe",
  namespace: "Package",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  imageSource: "/images/thomas.jpg",
  downloadCount: 4500000,
  likes: 1342,
  size: 13000,
  author: "Gigamies5000",
  lastUpdated: "2023-01-01",
  isPinned: true,
  isNsfw: false,
  isDeprecated: false,
  categories: ["tweaks", "mods", "client-side"], // Category ids
};

const extremePackageData: PackagePreview = {
  name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis nibh commodo cursus. Nulla facilisi.",
  namespace: "Package",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit.",
  imageSource: "/images/thomas.jpg",
  downloadCount: 4500000000000,
  likes: 1342000000,
  size: 13000000,
  author: "Gigamies5000",
  lastUpdated: "2023-01-01",
  isPinned: false,
  isNsfw: true,
  isDeprecated: true,
  categories: [
    "tweaks",
    "mods",
    "client-side",
    "asdf",
    "gjdhf",
    "hogifuasdasdafhauyupcovbxyy",
    "28734",
    "uwyert",
    "qwerty",
  ], // Category ids
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

const MinimalPackageCard = Template.bind({});
MinimalPackageCard.args = {};

const ReferencePackageCard = Template.bind({});
ReferencePackageCard.args = {
  packageData: packageData,
};

const ExtremePackageCard = Template.bind({});
ExtremePackageCard.args = {
  packageData: extremePackageData,
};

export { MinimalPackageCard, ReferencePackageCard, ExtremePackageCard };
