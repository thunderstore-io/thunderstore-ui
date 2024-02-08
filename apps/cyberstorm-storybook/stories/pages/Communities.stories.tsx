import { StoryFn, Meta } from "@storybook/react";
import CommunitiesLayout from "../../../cyberstorm-nextjs/app/communities/layout";
import Page from "../../../cyberstorm-nextjs/app/communities/page";
import React from "react";

const meta = {
  title: "Cyberstorm/Pages/Communities",
  component: CommunitiesLayout,
} as Meta<typeof CommunitiesLayout>;

const Template: StoryFn<typeof CommunitiesLayout> = () => (
  <CommunitiesLayout>
    <Page />
  </CommunitiesLayout>
);

const DefaultCommunityListLayout = Template.bind({});

export { meta as default, DefaultCommunityListLayout as CommunityList };
