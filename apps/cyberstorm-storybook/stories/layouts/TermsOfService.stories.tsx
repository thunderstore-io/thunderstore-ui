import { StoryFn, Meta } from "@storybook/react";
import { TermsOfServiceLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/SimplePages",
  component: TermsOfServiceLayout,
} as Meta;

const Template: StoryFn<typeof TermsOfServiceLayout> = () => (
  <div>
    <TermsOfServiceLayout />
  </div>
);

const DefaultTermsOfServiceLayout = Template.bind({});

export { DefaultTermsOfServiceLayout as TermsOfService };
