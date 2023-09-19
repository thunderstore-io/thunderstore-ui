import { StoryFn, Meta } from "@storybook/react";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/PackageList",
  component: PackageListLayout,
} as Meta;

const Template: StoryFn<typeof PackageListLayout> = (args) => (
  <div>
    <PackageListLayout communityId="community" />
  </div>
);

const DefaultPackageListLayout = Template.bind({});

export { DefaultPackageListLayout as PackageList };
