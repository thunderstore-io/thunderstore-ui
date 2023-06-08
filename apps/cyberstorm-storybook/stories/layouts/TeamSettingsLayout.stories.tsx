import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TeamSettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamSettingsLayout,
} as ComponentMeta<typeof TeamSettingsLayout>;

const Template: ComponentStory<typeof TeamSettingsLayout> = () => (
  <div>
    <TeamSettingsLayout teamId="team" />
  </div>
);

const DefaultTeamSettingsLayout = Template.bind({});

export { meta as default, DefaultTeamSettingsLayout as TeamSettings };
