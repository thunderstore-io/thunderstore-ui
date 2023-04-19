import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  ManifestValidatorLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: ManifestValidatorLayout,
} as ComponentMeta<typeof ManifestValidatorLayout>;

const Template: ComponentStory<typeof ManifestValidatorLayout> = () => (
  <div>
    <Heading />
    <ManifestValidatorLayout />
    <Footer />
  </div>
);

const DefaultManifestValidatorLayout = Template.bind({});
DefaultManifestValidatorLayout.args = {};

export { meta as default, DefaultManifestValidatorLayout };
