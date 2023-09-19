import { StoryFn, Meta } from "@storybook/react";
import { PackageUploadLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageUploadLayout,
} as Meta;

const Template: StoryFn<typeof PackageUploadLayout> = () => (
  <div>
    <PackageUploadLayout />
  </div>
);

const DefaultPackageUploadLayout = Template.bind({});

export { DefaultPackageUploadLayout as PackageUpload };
