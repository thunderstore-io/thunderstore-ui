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
  packageId: "package",
};

export { ReferencePackageCard };
