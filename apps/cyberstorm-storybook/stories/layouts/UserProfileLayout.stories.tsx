import { ComponentStory, ComponentMeta } from "@storybook/react";
import { UserProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/UserProfile",
  component: UserProfileLayout,
} as ComponentMeta<typeof UserProfileLayout>;

const Template: ComponentStory<typeof UserProfileLayout> = () => (
  <div>
    <UserProfileLayout userId="user" />
  </div>
);

const DefaultUserProfileLayout = Template.bind({});

export { meta as default, DefaultUserProfileLayout as UserProfile };
