import { StoryFn, Meta } from "@storybook/react";
import { ManifestValidatorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: ManifestValidatorLayout,
} as Meta<typeof ManifestValidatorLayout>;

const Template: StoryFn<typeof ManifestValidatorLayout> = () => (
  <div>
    <ManifestValidatorLayout />
  </div>
);

const DefaultManifestValidatorLayout = Template.bind({});

export { meta as default, DefaultManifestValidatorLayout as ManifestValidator };
