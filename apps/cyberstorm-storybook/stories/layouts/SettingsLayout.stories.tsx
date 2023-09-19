import { StoryFn, Meta } from "@storybook/react";
import { SettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Settings",
  component: SettingsLayout,
} as Meta;

const Template: StoryFn<typeof SettingsLayout> = () => (
  <div>
    <SettingsLayout userId="settingsUser" />
  </div>
);

const DefaultSettingsLayout = Template.bind({});

export { DefaultSettingsLayout as Settings };
