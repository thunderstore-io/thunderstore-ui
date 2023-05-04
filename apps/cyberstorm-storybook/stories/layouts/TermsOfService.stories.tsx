import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TermsOfServiceLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: TermsOfServiceLayout,
} as ComponentMeta<typeof TermsOfServiceLayout>;

const Template: ComponentStory<typeof TermsOfServiceLayout> = () => (
  <div>
    <TermsOfServiceLayout />
  </div>
);

const DefaultTermsOfServiceLayout = Template.bind({});
DefaultTermsOfServiceLayout.args = {};

export { meta as default, DefaultTermsOfServiceLayout };
