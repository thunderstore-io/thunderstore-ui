import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TeamLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamLayout,
} as ComponentMeta<typeof TeamLayout>;

const Template: ComponentStory<typeof TeamLayout> = () => (
  <div>
    <TeamLayout teamId="team" />
  </div>
);

const DefaultTeamLayout = Template.bind({});

export { meta as default, DefaultTeamLayout as Team };