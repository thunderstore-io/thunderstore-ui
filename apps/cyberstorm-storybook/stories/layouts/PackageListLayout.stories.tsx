import { StoryFn, ComponentMeta } from "@storybook/react";
import { Footer, Heading, PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageListLayout",
  component: PackageListLayout,
} as ComponentMeta<typeof PackageListLayout>;

const defaultArgs = {
  communityId: "1337",
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
