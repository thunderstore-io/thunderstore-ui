import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, NotFoundLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: NotFoundLayout,
} as ComponentMeta<typeof NotFoundLayout>;

const Template: ComponentStory<typeof NotFoundLayout> = (args) => (
  <div>
    <Heading />
    <NotFoundLayout {...args} />
    <Footer />
  </div>
);

const DefaultNotFoundLayout = Template.bind({});
DefaultNotFoundLayout.args = {};

export { meta as default, DefaultNotFoundLayout };
