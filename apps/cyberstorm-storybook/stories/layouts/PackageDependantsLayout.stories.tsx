import { StoryFn, Meta } from "@storybook/react";
import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDependants",
  component: PackageDependantsLayout,
} as Meta<typeof PackageDependantsLayout>;

const Template: StoryFn<typeof PackageDependantsLayout> = () => (
  <PackageDependantsLayout
    communityId="brotato"
    namespaceId="otDan"
    packageName="WaveTimer"
  />
);
const PackageDependants = Template.bind({});

export { meta as default, PackageDependants };
