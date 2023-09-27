import { StoryFn, Meta } from "@storybook/react";
import { SettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Settings",
  component: SettingsLayout,
} as Meta<typeof SettingsLayout>;

const Template: StoryFn<typeof SettingsLayout> = () => (
  <div>
    <SettingsLayout userId="settingsUser" />
  </div>
);

const DefaultSettingsLayout = Template.bind({});

export { meta as default, DefaultSettingsLayout as Settings };
