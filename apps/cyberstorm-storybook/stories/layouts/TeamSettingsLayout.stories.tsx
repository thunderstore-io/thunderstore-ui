import { StoryFn, Meta } from "@storybook/react";
import { TeamSettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamSettingsLayout,
} as Meta;

const Template: StoryFn<typeof TeamSettingsLayout> = () => (
  <div>
    <TeamSettingsLayout teamId="team" />
  </div>
);

const DefaultTeamSettingsLayout = Template.bind({});

export { DefaultTeamSettingsLayout as TeamSettings };
