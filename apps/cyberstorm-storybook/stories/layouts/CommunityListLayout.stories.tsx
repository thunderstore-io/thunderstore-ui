import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CommunityListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/CommunityList",
  component: CommunityListLayout,
} as ComponentMeta<typeof CommunityListLayout>;

const Template: ComponentStory<typeof CommunityListLayout> = () => (
  <div>
    <CommunityListLayout />
  </div>
);

const DefaultCommunityListLayout = Template.bind({});

export { meta as default, DefaultCommunityListLayout as CommunityList };
