import { StoryFn, Meta } from "@storybook/react";
import { PrivacyPolicyLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: PrivacyPolicyLayout,
} as Meta<typeof PrivacyPolicyLayout>;

const Template: StoryFn<typeof PrivacyPolicyLayout> = () => (
  <div>
    <PrivacyPolicyLayout />
  </div>
);

const DefaultPrivacyPolicyLayout = Template.bind({});

export { meta as default, DefaultPrivacyPolicyLayout as PrivacyPolicy };
