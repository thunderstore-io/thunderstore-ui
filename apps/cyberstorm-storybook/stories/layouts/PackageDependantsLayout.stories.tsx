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
} as Package;

const Template: StoryFn<typeof PackageDependantsLayout> = () => (
  <PackageDependantsLayout package={packageData} />
);
const PackageDependants = Template.bind({});

export { meta as default, PackageDependants };
