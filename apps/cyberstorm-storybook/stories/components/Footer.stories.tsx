import { StoryFn, Meta } from "@storybook/react";
import { Footer } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Footer",
  component: Footer,
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => <Footer />;

const ReferenceFooter = Template.bind({});
ReferenceFooter.args = {};

export { meta as default, ReferenceFooter };
