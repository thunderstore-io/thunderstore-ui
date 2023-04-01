import { StoryFn, Meta } from "@storybook/react";
import { ProfilePanel } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/ProfilePanel",
  component: ProfilePanel,
} as Meta;

const style: React.CSSProperties = {
  height: "500px",
};
const mods = [
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  {
    name: "LongNamedBeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeMod",
    version: "1.0.0",
    url: "example.com",
  },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
  { name: "TestMod1", version: "1.0.0", url: "example.com" },
];
const profile = { name: "Test Profile", code: "test_code", mods: mods };

const Template: StoryFn<typeof ProfilePanel> = (args) => (
  <div style={style}>
    <ProfilePanel {...args} />
  </div>
);

const ReferenceProfilePanel = Template.bind({});
ReferenceProfilePanel.args = { profile: profile };

export { ReferenceProfilePanel };
