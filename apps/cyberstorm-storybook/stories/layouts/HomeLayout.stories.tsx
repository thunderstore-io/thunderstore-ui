import { StoryFn, Meta } from "@storybook/react";
import { HomeLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Home",
  component: HomeLayout,
} as Meta;

const Template: StoryFn<typeof HomeLayout> = () => (
  <div>
    <HomeLayout />
  </div>
);

const DefaultHomeLayout = Template.bind({});

export { DefaultHomeLayout as Home };
