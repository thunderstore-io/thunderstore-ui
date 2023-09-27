import { StoryFn, Meta } from "@storybook/react";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageList",
  component: PackageListLayout,
} as Meta<typeof PackageListLayout>;

const Template: StoryFn<typeof PackageListLayout> = (args) => (
  <div>
    <PackageListLayout communityId="community" />
  </div>
);

const DefaultPackageListLayout = Template.bind({});

export { meta as default, DefaultPackageListLayout as PackageList };
