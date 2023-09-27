import { StoryFn, Meta } from "@storybook/react";
import { HomeLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Home",
  component: HomeLayout,
} as Meta<typeof HomeLayout>;

const Template: StoryFn<typeof HomeLayout> = () => (
  <div>
    <HomeLayout />
  </div>
);

const DefaultHomeLayout = Template.bind({});

export { meta as default, DefaultHomeLayout as Home };
