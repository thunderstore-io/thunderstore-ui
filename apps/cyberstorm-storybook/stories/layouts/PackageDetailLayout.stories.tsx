import { StoryFn, Meta } from "@storybook/react";
import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDetails",
  component: PackageDetailLayout,
} as Meta<typeof PackageDetailLayout>;

const Template: StoryFn<typeof PackageDetailLayout> = (args) => (
  <PackageDetailLayout {...args} />
);

const ReferencePackageDetailLayout = Template.bind({});
ReferencePackageDetailLayout.args = {
  communityId: "Train City 2042",
  namespaceId: "Mechanics",
  packageName: "Thomas_the_Dankiest_Engine",
};

export { meta as default, ReferencePackageDetailLayout as PackageDetails };
