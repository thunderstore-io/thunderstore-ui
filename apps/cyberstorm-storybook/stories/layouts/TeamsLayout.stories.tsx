import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TeamsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/TeamSettingsLayout",
  component: TeamsLayout,
} as ComponentMeta<typeof TeamsLayout>;

const Template: ComponentStory<typeof TeamsLayout> = (args) => (
  <div>
    <TeamsLayout />
  </div>
);

const DefaultTeamsLayout = Template.bind({});
DefaultTeamsLayout.args = {};

export { meta as default, DefaultTeamsLayout };
