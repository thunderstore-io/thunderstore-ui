import { StoryFn, Meta } from "@storybook/react";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageList",
  component: PackageListLayout,
} as Meta<typeof PackageListLayout>;

const Template: StoryFn<typeof PackageListLayout> = () => (
  <PackageListLayout communityId="community" />
);
const PackageList = Template.bind({});

export { meta as default, PackageList };
