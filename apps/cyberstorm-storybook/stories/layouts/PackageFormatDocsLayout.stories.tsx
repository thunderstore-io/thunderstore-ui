import { StoryFn, Meta } from "@storybook/react";
import { PackageFormatDocsLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageFormatDocsLayout,
} as Meta;

const Template: StoryFn<typeof PackageFormatDocsLayout> = () => (
  <div>
    <PackageFormatDocsLayout />
  </div>
);

const DefaultPackageFormatDocsLayout = Template.bind({});

export { DefaultPackageFormatDocsLayout as PackageFormatDocs };
