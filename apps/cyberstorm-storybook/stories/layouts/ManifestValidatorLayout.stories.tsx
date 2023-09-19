import { StoryFn, Meta } from "@storybook/react";
import { ManifestValidatorLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Developers",
  component: ManifestValidatorLayout,
} as Meta;

const Template: StoryFn<typeof ManifestValidatorLayout> = () => (
  <div>
    <ManifestValidatorLayout />
  </div>
);

const DefaultManifestValidatorLayout = Template.bind({});

export { DefaultManifestValidatorLayout as ManifestValidator };
