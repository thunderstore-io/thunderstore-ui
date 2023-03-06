import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, SettingsLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SettingsLayout",
  component: SettingsLayout,
} as ComponentMeta<typeof SettingsLayout>;

const defaultArgs = {};

const Template: ComponentStory<typeof SettingsLayout> = (args) => (
  <div>
    <Heading />
    <SettingsLayout {...args} />
    <Footer />
  </div>
);

const DefaultSettingsLayout = Template.bind({});
DefaultSettingsLayout.args = { ...defaultArgs };

export { meta as default, DefaultSettingsLayout };
