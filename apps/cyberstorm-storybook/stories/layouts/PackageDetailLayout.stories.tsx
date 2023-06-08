import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDetails",
  component: PackageDetailLayout,
} as ComponentMeta<typeof PackageDetailLayout>;

const Template: ComponentStory<typeof PackageDetailLayout> = (args) => (
  <div>
    <PackageDetailLayout {...args} />
  </div>
);

const defaultArgs = {
  packageId: "1337",
};

const ReferencePackageDetailLayout = Template.bind({});
ReferencePackageDetailLayout.args = defaultArgs;

const ManagePackageDetailLayout = Template.bind({});
ManagePackageDetailLayout.args = {
  ...defaultArgs,
  managementDialogIsOpen: true,
};

export {
  meta as default,
  ReferencePackageDetailLayout as PackageDetails,
  ManagePackageDetailLayout as PackageDetailsDialog,
};
