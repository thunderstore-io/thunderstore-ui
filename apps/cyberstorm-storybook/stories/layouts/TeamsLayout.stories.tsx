import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TeamsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/TeamsLayout",
  component: TeamsLayout,
} as ComponentMeta<typeof TeamsLayout>;

const defaultArgs = {
  teamId: "1337",
};

const Template: ComponentStory<typeof TeamsLayout> = (args) => (
  <div>
    <TeamsLayout {...args} />
  </div>
);

const DefaultTeamsLayout = Template.bind({});
DefaultTeamsLayout.args = { ...defaultArgs };

export { meta as default, DefaultTeamsLayout };
