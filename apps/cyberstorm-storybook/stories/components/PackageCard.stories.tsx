import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageCard } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/PackageCard",
  component: PackageCard,
} as ComponentMeta<typeof PackageCard>;

const defaultArgs = {};
const style = {
  backgroundColor: "",
  padding: "3rem",
  flexWrap: "wrap",
  display: "flex",
  flexDirection: "row",
  gap: "1rem",
};

const Template: ComponentStory<typeof PackageCard> = (args) => (
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

const DefaultPackageCard = Template.bind({});
DefaultPackageCard.args = { ...defaultArgs };

const FirstPackageCard = Template.bind({});
FirstPackageCard.args = {
  ...defaultArgs,
  imageSrc: "/images/thomas.png",
  packageName: "MinisterAPI DeLuxe",
  author: "Gigamies5000",
  description:
    "Lorem ipsum dolor sit amet, lollero pollero long text ellipsis continued even further",
  lastUpdated: "3 days ago",
  likes: "1,342",
};

export { meta as default, DefaultPackageCard, FirstPackageCard };
