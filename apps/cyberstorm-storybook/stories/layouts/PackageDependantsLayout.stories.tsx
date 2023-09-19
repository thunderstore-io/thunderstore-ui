import { StoryFn, Meta } from "@storybook/react";
import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import { Package } from "@thunderstore/dapper/types";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/PackageDependants",
  component: PackageDependantsLayout,
} as Meta;

const packageData = {
  community: "brotato",
  namespace: "otDan",
  name: "WaveTimer",
  author: "otDan",
} as Package;

const Template: StoryFn<typeof PackageDependantsLayout> = () => (
  <div>
    <PackageDependantsLayout packageData={packageData} />
  </div>
);

const DefaultPackageDependantsLayout = Template.bind({});

export { DefaultPackageDependantsLayout as PackageDependants };
