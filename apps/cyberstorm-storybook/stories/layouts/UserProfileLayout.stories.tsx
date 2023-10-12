import { StoryFn, Meta } from "@storybook/react";
import { UserProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/UserProfile",
  component: UserProfileLayout,
} as Meta<typeof UserProfileLayout>;

const Template: StoryFn<typeof UserProfileLayout> = () => (
  <UserProfileLayout userId="user" />
);

const UserProfile = Template.bind({});

export { meta as default, UserProfile };
