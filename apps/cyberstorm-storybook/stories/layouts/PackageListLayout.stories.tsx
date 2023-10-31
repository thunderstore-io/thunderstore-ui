import { StoryFn, Meta } from "@storybook/react";
import { CommunityProfileLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/CommunityProfile",
  component: CommunityProfileLayout,
} as Meta<typeof CommunityProfileLayout>;

const Template: StoryFn<typeof CommunityProfileLayout> = () => (
  <CommunityProfileLayout communityId="riskofrain2" />
);
const CommunityProfile = Template.bind({});

export { meta as default, CommunityProfile };
