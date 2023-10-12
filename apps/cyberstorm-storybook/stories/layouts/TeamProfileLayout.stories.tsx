import { StoryFn, Meta } from "@storybook/react";
import { TeamProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/TeamProfile",
  component: TeamProfileLayout,
} as Meta<typeof TeamProfileLayout>;

const Template: StoryFn<typeof TeamProfileLayout> = () => (
  <TeamProfileLayout teamId="team" />
);

const TeamProfile = Template.bind({});

export { meta as default, TeamProfile };
