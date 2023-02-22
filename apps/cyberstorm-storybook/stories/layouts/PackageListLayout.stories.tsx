import { StoryFn, Meta } from "@storybook/react";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/PackageListLayout",
  component: PackageListLayout,
} as Meta;

const defaultArgs = {
  title: "V Rising",
};

const Template: StoryFn<typeof PackageListLayout> = (args) => (
  <PackageListLayout {...args} />
);

const DefaultPackageListLayout = Template.bind({});
DefaultPackageListLayout.args = defaultArgs;

export { DefaultPackageListLayout };
