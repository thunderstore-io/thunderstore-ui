import { StoryFn, Meta } from "@storybook/react";
import { CommunityCard } from "@thunderstore/cyberstorm";
import React from "react";

const style: React.CSSProperties = {
  padding: "3rem",
  flexWrap: "wrap",
  display: "grid",
  flexDirection: "row",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(15.5rem, 1fr))",
};

const defaultCommunity = {
  name: "Risk of Rain 2",
  identifier: "",
  short_description: "",
  description: "",
  wiki_url: "",
  discord_url: "",
  datetime_created: "",
  hero_image_url: "",
  cover_image_url: "",
  icon_url: "",
  total_download_count: 0,
  total_package_count: 0,
};

const meta = {
  title: "Cyberstorm/Components/CommunityCard",
  component: CommunityCard,
} as Meta<typeof CommunityCard>;

const Template: StoryFn<typeof CommunityCard> = (args) => (
  <div style={style}>
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
    <CommunityCard {...args} />
  </div>
);

const ReferenceCommunityCard = Template.bind({});
ReferenceCommunityCard.args = { community: defaultCommunity };

const LongCommunityCard = Template.bind({});
LongCommunityCard.args = {
  community: {
    ...defaultCommunity,
    name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    total_download_count: 123456789,
    total_package_count: 123456789,
  },
};

export { meta as default, ReferenceCommunityCard, LongCommunityCard };
