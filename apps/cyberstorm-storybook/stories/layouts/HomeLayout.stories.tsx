import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HomeLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/HomeLayout",
  component: HomeLayout,
} as ComponentMeta<typeof HomeLayout>;

const Template: ComponentStory<typeof HomeLayout> = (args) => (
  <HomeLayout {...args} />
);

const DefaultHomeLayout = Template.bind({});
DefaultHomeLayout.args = {};

export { meta as default, DefaultHomeLayout };
