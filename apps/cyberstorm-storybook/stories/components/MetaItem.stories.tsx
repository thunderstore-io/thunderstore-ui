import { StoryFn, Meta } from "@storybook/react";
import { MetaItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/MetaItem",
  component: MetaItem,
} as Meta;

const defaultArgs = {
  label: "-",
  colorScheme: "default",
};

const Template: StoryFn<typeof MetaItem> = (args) => <MetaItem {...args} />;

const MinimalMetaItem = Template.bind({});
MinimalMetaItem.args = {
  ...defaultArgs,
};

const TertiaryMetaItem = Template.bind({});
TertiaryMetaItem.args = {
  ...defaultArgs,
  label: "Lollero",
  colorScheme: "tertiary",
  icon: <FontAwesomeIcon fixedWidth icon={faUser} />,
};

const LikesMetaItem = Template.bind({});
LikesMetaItem.args = {
  ...defaultArgs,
  label: "1,342",
  colorScheme: "default",
  icon: <FontAwesomeIcon fixedWidth icon={faThumbsUp} />,
};

export { MinimalMetaItem, TertiaryMetaItem, LikesMetaItem };
