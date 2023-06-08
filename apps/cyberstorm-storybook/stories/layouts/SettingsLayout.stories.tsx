import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Settings",
  component: SettingsLayout,
} as ComponentMeta<typeof SettingsLayout>;

const defaultArgs = {};

const Template: ComponentStory<typeof SettingsLayout> = (args) => (
  <div>
    <SettingsLayout {...args} />
  </div>
);

const DefaultSettingsLayout = Template.bind({});
DefaultSettingsLayout.args = { ...defaultArgs };

export { meta as default, DefaultSettingsLayout as Settings };
