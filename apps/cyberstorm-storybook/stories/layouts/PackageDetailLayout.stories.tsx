import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, PackageDetailLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDetailLayout",
  component: PackageDetailLayout,
} as ComponentMeta<typeof PackageDetailLayout>;

const Template: ComponentStory<typeof PackageDetailLayout> = (args) => (
  <div>
    <Heading />
    <PackageDetailLayout {...args} />
    <Footer />
  </div>
);

const defaultArgs = {
  packageId: 123,
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
  ReferencePackageDetailLayout,
  ManagePackageDetailLayout,
};
