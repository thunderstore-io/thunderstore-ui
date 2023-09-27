import { StoryFn, Meta } from "@storybook/react";
import { PackageFormatDocsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageFormatDocsLayout,
} as Meta<typeof PackageFormatDocsLayout>;

const Template: StoryFn<typeof PackageFormatDocsLayout> = () => (
  <div>
    <PackageFormatDocsLayout />
  </div>
);

const DefaultPackageFormatDocsLayout = Template.bind({});

export { meta as default, DefaultPackageFormatDocsLayout as PackageFormatDocs };
