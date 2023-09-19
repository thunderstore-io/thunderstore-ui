import { StoryFn, Meta } from "@storybook/react";
import { PrivacyPolicyLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/SimplePages",
  component: PrivacyPolicyLayout,
} as Meta;

const Template: StoryFn<typeof PrivacyPolicyLayout> = () => (
  <div>
    <PrivacyPolicyLayout />
  </div>
);

const DefaultPrivacyPolicyLayout = Template.bind({});

export { DefaultPrivacyPolicyLayout as PrivacyPolicy };
