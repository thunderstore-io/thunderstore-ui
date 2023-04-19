import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  PackageFormatDocsLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: PackageFormatDocsLayout,
} as ComponentMeta<typeof PackageFormatDocsLayout>;

const Template: ComponentStory<typeof PackageFormatDocsLayout> = () => (
  <div>
    <Heading />
    <PackageFormatDocsLayout />
    <Footer />
  </div>
);

const DefaultPackageFormatDocsLayout = Template.bind({});
DefaultPackageFormatDocsLayout.args = {};

export { meta as default, DefaultPackageFormatDocsLayout };
