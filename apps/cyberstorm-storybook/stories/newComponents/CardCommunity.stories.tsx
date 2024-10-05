import { StoryFn, Meta } from "@storybook/react";
import { CardCommunity } from "@thunderstore/cyberstorm";
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
  description: "",
  discord_url: "",
  datetime_created: "",
  background_image_url: "",
  cover_image_url: "",
  icon_url: "",
  total_download_count: 0,
  total_package_count: 0,
};

const meta = {
  title: "CardCommunity",
  component: CardCommunity,
} as Meta<typeof CardCommunity>;

const Template: StoryFn<typeof CardCommunity> = (args) => (
  <div style={style}>
    <CardCommunity isPopular isNew {...args} />
    <CardCommunity isPopular {...args} />
    <CardCommunity isNew {...args} />
    <CardCommunity {...args} />
    <CardCommunity {...args} />
    <CardCommunity {...args} />
    <CardCommunity {...args} />
    <CardCommunity {...args} />
    <CardCommunity {...args} />
  </div>
);

const ReferenceCardCommunity = Template.bind({});
ReferenceCardCommunity.args = { community: defaultCommunity };

const LongCardCommunity = Template.bind({});
LongCardCommunity.args = {
  community: {
    ...defaultCommunity,
    name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    total_download_count: 123456789,
    total_package_count: 123456789,
  },
};

export { meta as default, ReferenceCardCommunity, LongCardCommunity };
