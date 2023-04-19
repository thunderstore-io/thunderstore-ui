import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, PackageUploadLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageUploadLayout,
} as ComponentMeta<typeof PackageUploadLayout>;

const Template: ComponentStory<typeof PackageUploadLayout> = () => (
  <div>
    <Heading />
    <PackageUploadLayout />
    <Footer />
  </div>
);

const DefaultPackageUploadLayout = Template.bind({});
DefaultPackageUploadLayout.args = {};

export { meta as default, DefaultPackageUploadLayout };
