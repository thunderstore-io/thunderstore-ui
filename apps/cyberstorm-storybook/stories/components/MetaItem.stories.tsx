import { StoryFn, Meta } from "@storybook/react";
import { Icon, MetaItem, MetaItemProps } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/MetaItem",
  component: MetaItem,
} as Meta<typeof MetaItem>;

const defaultArgs: MetaItemProps = {
  label: "-",
  colorScheme: "default",
};

const Template: StoryFn<typeof MetaItem> = (args) => <MetaItem {...args} />;

const MinimalMetaItem = Template.bind({});
MinimalMetaItem.args = {
  ...defaultArgs,
};

const AccentMetaItem = Template.bind({});
AccentMetaItem.args = {
  ...defaultArgs,
  label: "Lollero",
  colorScheme: "accent",
  icon: (
    <Icon>
      <FontAwesomeIcon icon={faUser} />
    </Icon>
  ),
};

const LikesMetaItem = Template.bind({});
LikesMetaItem.args = {
  ...defaultArgs,
  label: "1,342",
  colorScheme: "default",
  icon: (
    <Icon>
      <FontAwesomeIcon icon={faThumbsUp} />
    </Icon>
  ),
};

export { meta as default, MinimalMetaItem, AccentMetaItem, LikesMetaItem };
