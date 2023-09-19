import { StoryFn, Meta } from "@storybook/react";
import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/PackageDetails",
  component: PackageDetailLayout,
} as Meta;

const Template: StoryFn<typeof PackageDetailLayout> = (args) => (
  <div>
    <PackageDetailLayout {...args} />
  </div>
);

const defaultArgs = {
  community: "Train City 2042",
  namespace: "Mechanics",
  packagepackageNameId: "Thomas the Dankiest Engine",
};

const ReferencePackageDetailLayout = Template.bind({});
ReferencePackageDetailLayout.args = defaultArgs;

const ManagePackageDetailLayout = Template.bind({});
ManagePackageDetailLayout.args = {
  ...defaultArgs,
  managementDialogIsOpen: true,
};

export {
  ReferencePackageDetailLayout as PackageDetails,
  ManagePackageDetailLayout as PackageDetailsDialog,
};
