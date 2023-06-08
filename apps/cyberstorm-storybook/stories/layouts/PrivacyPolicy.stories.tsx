import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PrivacyPolicyLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: PrivacyPolicyLayout,
} as ComponentMeta<typeof PrivacyPolicyLayout>;

const Template: ComponentStory<typeof PrivacyPolicyLayout> = () => (
  <div>
    <PrivacyPolicyLayout />
  </div>
);

const DefaultPrivacyPolicyLayout = Template.bind({});
DefaultPrivacyPolicyLayout.args = {};

export { meta as default, DefaultPrivacyPolicyLayout as PrivacyPolicy };
