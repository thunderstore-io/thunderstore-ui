import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  TermsOfServiceLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: TermsOfServiceLayout,
} as ComponentMeta<typeof TermsOfServiceLayout>;

const Template: ComponentStory<typeof TermsOfServiceLayout> = (args) => (
  <div>
    <Heading />
    <TermsOfServiceLayout {...args} />
    <Footer />
  </div>
);

const DefaultTermsOfServiceLayout = Template.bind({});
DefaultTermsOfServiceLayout.args = {};

export { meta as default, DefaultTermsOfServiceLayout };
