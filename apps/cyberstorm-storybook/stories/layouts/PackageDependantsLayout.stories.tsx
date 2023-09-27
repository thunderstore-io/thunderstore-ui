import { StoryFn, Meta } from "@storybook/react";
import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import { Package } from "@thunderstore/dapper/types";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDependants",
  component: PackageDependantsLayout,
} as Meta<typeof PackageDependantsLayout>;

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

export { meta as default, DefaultPackageDependantsLayout as PackageDependants };
