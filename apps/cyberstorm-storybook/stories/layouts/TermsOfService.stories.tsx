import { StoryFn, Meta } from "@storybook/react";
import { TermsOfServiceLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: TermsOfServiceLayout,
} as Meta<typeof TermsOfServiceLayout>;

const Template: StoryFn<typeof TermsOfServiceLayout> = () => (
  <div>
    <TermsOfServiceLayout />
  </div>
);

const DefaultTermsOfServiceLayout = Template.bind({});

export { meta as default, DefaultTermsOfServiceLayout as TermsOfService };
