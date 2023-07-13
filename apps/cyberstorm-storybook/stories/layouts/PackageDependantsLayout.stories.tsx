import { StoryFn, ComponentMeta } from "@storybook/react";
import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import { getPackageDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDependants",
  component: PackageDependantsLayout,
} as ComponentMeta<typeof PackageDependantsLayout>;

const Template: StoryFn<typeof PackageDependantsLayout> = () => (
  <div>
    <PackageDependantsLayout packageData={getPackageDummyData("1")} />
  </div>
);

const DefaultPackageDependantsLayout = Template.bind({});

export { meta as default, DefaultPackageDependantsLayout as PackageDependants };
