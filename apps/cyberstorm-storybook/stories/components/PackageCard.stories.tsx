import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageCard } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/PackageCard",
  component: PackageCard,
} as ComponentMeta<typeof PackageCard>;

const defaultArgs = {
  packageCardStyle: "default",
};
const style = {
  padding: "3rem",
  flexWrap: "wrap",
  display: "grid",
  flexDirection: "row",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(15.5rem, 1fr))",
};

const Template: ComponentStory<typeof PackageCard> = (args) => (
  <div style={style}>
    <PackageCard {...args} />
    <PackageCard {...args} categories={[]} />
    <PackageCard {...args} description={"Lorem ipsum."} />
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
MinimalPackageCard.args = { ...defaultArgs };

const ReferencePackageCard = Template.bind({});
ReferencePackageCard.args = {
  ...defaultArgs,
  imageSrc: "/images/thomas.png",
  packageName: "MinisterAPI DeLuxe",
  author: "Gigamies5000",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit.",
  lastUpdated: "3 days ago",
  downloadCount: "4,5M",
  likes: "1,342",
  size: "13 MB",
  categories: ["tweaks", "mods", "client-side"],
  link: "",
  isPinned: true,
};

const ExtremePackageCard = Template.bind({});
ExtremePackageCard.args = {
  ...defaultArgs,
  imageSrc: "/images/thomas.png",
  packageName:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis nibh commodo cursus. Nulla facilisi.",
  author: "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  lastUpdated: "3 days ago",
  downloadCount: "12345",
  likes: "1234567890",
  size: "1234567 abcdefghijklmn",
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
  ],
  link: "",
  isPinned: true,
  isNsfw: true,
  isDeprecated: true,
};

export {
  meta as default,
  MinimalPackageCard,
  ReferencePackageCard,
  ExtremePackageCard,
};
