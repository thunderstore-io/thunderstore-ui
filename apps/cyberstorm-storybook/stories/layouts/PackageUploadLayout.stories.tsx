import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageUploadLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageUploadLayout,
} as ComponentMeta<typeof PackageUploadLayout>;

const Template: ComponentStory<typeof PackageUploadLayout> = () => (
  <div>
    <PackageUploadLayout />
  </div>
);

const DefaultPackageUploadLayout = Template.bind({});

export { meta as default, DefaultPackageUploadLayout as PackageUpload };
