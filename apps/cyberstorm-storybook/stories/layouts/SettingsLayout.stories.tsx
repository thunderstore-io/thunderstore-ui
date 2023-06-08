import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Settings",
  component: SettingsLayout,
} as ComponentMeta<typeof SettingsLayout>;

const Template: ComponentStory<typeof SettingsLayout> = () => (
  <div>
    <SettingsLayout userId="user" />
  </div>
);

const DefaultSettingsLayout = Template.bind({});

export { meta as default, DefaultSettingsLayout as Settings };
