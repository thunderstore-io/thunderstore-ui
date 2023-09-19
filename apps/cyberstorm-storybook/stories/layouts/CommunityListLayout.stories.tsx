import { StoryFn, Meta } from "@storybook/react";
import { CommunityListLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/CommunityList",
  component: CommunityListLayout,
} as Meta<typeof CommunityListLayout>;

const Template: StoryFn<typeof CommunityListLayout> = () => (
  <div>
    <CommunityListLayout />
  </div>
);

const DefaultCommunityListLayout = Template.bind({});

export { DefaultCommunityListLayout as CommunityList };
