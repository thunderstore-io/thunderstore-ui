import { StoryFn, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  PackageDetailLayout,
  PackageListLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageListLayout",
  component: PackageListLayout,
} as ComponentMeta<typeof PackageDetailLayout>;

const defaultArgs = {
  title: "V Rising",
};

const Template: StoryFn<typeof PackageListLayout> = (args) => (
  <div>
    <Heading />
    <PackageListLayout {...args} />
    <Footer />
  </div>
);

const DefaultPackageListLayout = Template.bind({});
DefaultPackageListLayout.args = defaultArgs;

export { meta as default, DefaultPackageListLayout };
