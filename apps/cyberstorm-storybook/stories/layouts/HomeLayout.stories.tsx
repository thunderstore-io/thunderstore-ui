import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, HomeLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/HomeLayout",
  component: HomeLayout,
} as ComponentMeta<typeof HomeLayout>;

const Template: ComponentStory<typeof HomeLayout> = () => (
  <div>
    <Heading />
    <HomeLayout />
    <Footer />
  </div>
);

const DefaultHomeLayout = Template.bind({});
DefaultHomeLayout.args = {};

export { meta as default, DefaultHomeLayout };
