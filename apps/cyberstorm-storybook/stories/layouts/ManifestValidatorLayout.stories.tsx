import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ManifestValidatorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: ManifestValidatorLayout,
} as ComponentMeta<typeof ManifestValidatorLayout>;

const Template: ComponentStory<typeof ManifestValidatorLayout> = () => (
  <div>
    <ManifestValidatorLayout />
  </div>
);

const DefaultManifestValidatorLayout = Template.bind({});

export { meta as default, DefaultManifestValidatorLayout as ManifestValidator };
