import { ComponentStory, ComponentMeta } from "@storybook/react";
import { UserProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/UserProfile",
  component: UserProfileLayout,
} as ComponentMeta<typeof UserProfileLayout>;

const Template: ComponentStory<typeof UserProfileLayout> = (args) => (
  <div>
    <UserProfileLayout userId="user" />
  </div>
);

const DefaultUserProfileLayout = Template.bind({});
DefaultUserProfileLayout.args = {};

export { meta as default, DefaultUserProfileLayout as UserProfile };
