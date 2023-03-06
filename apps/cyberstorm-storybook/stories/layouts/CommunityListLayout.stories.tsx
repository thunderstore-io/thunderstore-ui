import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CommunityListLayout, Footer, Heading } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/CommunityListLayout",
  component: CommunityListLayout,
} as ComponentMeta<typeof CommunityListLayout>;

const defaultArgs = {
  title: "V Rising",
};

const Template: ComponentStory<typeof CommunityListLayout> = (args) => (
  <div>
    <Heading />
    <CommunityListLayout {...args} />
    <Footer />
  </div>
);

const DefaultCommunityListLayout = Template.bind({});
DefaultCommunityListLayout.args = defaultArgs;

export { meta as default, DefaultCommunityListLayout };
