import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CommunityListLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/CommunityListLayout",
  component: CommunityListLayout,
} as ComponentMeta<typeof CommunityListLayout>;

const defaultArgs = {
  title: "V Rising",
};

const Template: ComponentStory<typeof CommunityListLayout> = () => (
  <div>
    <CommunityListLayout />
  </div>
);

const DefaultCommunityListLayout = Template.bind({});
DefaultCommunityListLayout.args = defaultArgs;

export { meta as default, DefaultCommunityListLayout };
