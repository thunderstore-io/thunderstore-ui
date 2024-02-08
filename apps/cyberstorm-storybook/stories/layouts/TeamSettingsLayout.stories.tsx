import { StoryFn, Meta } from "@storybook/react";
import { TeamSettingsLayout } from "@thunderstore/cyberstorm";
// import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Teams",
  component: TeamSettingsLayout,
} as Meta<typeof TeamSettingsLayout>;

// TODO: Fix sessions in storybook or remove layouts
const Template: StoryFn<typeof TeamSettingsLayout> = () => (
  <></>
  // <TeamSettingsLayout teamName="team" />
);

const TeamSettings = Template.bind({});

export { meta as default, TeamSettings };
