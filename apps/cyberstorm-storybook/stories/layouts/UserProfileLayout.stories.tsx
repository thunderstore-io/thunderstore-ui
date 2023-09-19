import { StoryFn, Meta } from "@storybook/react";
import { UserProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/UserProfile",
  component: UserProfileLayout,
} as Meta;

const Template: StoryFn<typeof UserProfileLayout> = () => (
  <div>
    <UserProfileLayout userId="user" />
  </div>
);

const DefaultUserProfileLayout = Template.bind({});

export { DefaultUserProfileLayout as UserProfile };
