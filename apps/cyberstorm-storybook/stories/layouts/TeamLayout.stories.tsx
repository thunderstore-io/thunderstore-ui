import { StoryFn, Meta } from "@storybook/react";
import { TeamLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamLayout,
} as Meta;

const Template: StoryFn<typeof TeamLayout> = () => (
  <div>
    <TeamLayout teamId="team" />
  </div>
);

const DefaultTeamLayout = Template.bind({});

export { DefaultTeamLayout as Team };
