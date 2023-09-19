import { StoryFn, Meta } from "@storybook/react";
import { TeamsLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamsLayout,
} as Meta;

const Template: StoryFn<typeof TeamsLayout> = () => (
  <div>
    <TeamsLayout />
  </div>
);

const DefaultTeamsLayout = Template.bind({});

export { DefaultTeamsLayout as Teams };
