import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TeamsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamsLayout,
} as ComponentMeta<typeof TeamsLayout>;

const Template: ComponentStory<typeof TeamsLayout> = () => (
  <div>
    <TeamsLayout />
  </div>
);

const DefaultTeamsLayout = Template.bind({});

export { meta as default, DefaultTeamsLayout as Teams };
