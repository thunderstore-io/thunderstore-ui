import { ComponentStory, ComponentMeta } from "@storybook/react";
import { NotFoundLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: NotFoundLayout,
} as ComponentMeta<typeof NotFoundLayout>;

const Template: ComponentStory<typeof NotFoundLayout> = (args) => (
  <NotFoundLayout {...args} />
);

const DefaultNotFoundLayout = Template.bind({});
DefaultNotFoundLayout.args = {};

export { meta as default, DefaultNotFoundLayout };
