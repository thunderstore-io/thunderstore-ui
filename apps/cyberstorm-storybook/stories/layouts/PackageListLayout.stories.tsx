import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageListLayout",
  component: PackageListLayout,
} as ComponentMeta<typeof PackageListLayout>;

const defaultArgs = {
  title: "V Rising",
};

const Template: ComponentStory<typeof PackageListLayout> = (args) => (
  <PackageListLayout {...args} />
);

const DefaultPackageListLayout = Template.bind({});
DefaultPackageListLayout.args = defaultArgs;

export { meta as default, DefaultPackageListLayout };
