import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MetaItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUser } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/MetaItem",
  component: MetaItem,
} as ComponentMeta<typeof MetaItem>;

const defaultArgs = {
  label: "-",
  metaItemStyle: "metaItem__default",
};

const Template: ComponentStory<typeof MetaItem> = (args) => (
  <MetaItem {...args} />
);

const DefaultMetaItem = Template.bind({});
DefaultMetaItem.args = {
  ...defaultArgs,
};

const TertiaryMetaItem = Template.bind({});
TertiaryMetaItem.args = {
  ...defaultArgs,
  label: "Lollero",
  metaItemStyle: "metaItem__tertiary",
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faUser}
      className={"metaItemIcon"}
    />
  ),
};

const LikesMetaItem = Template.bind({});
LikesMetaItem.args = {
  ...defaultArgs,
  label: "1,342",
  metaItemStyle: "metaItem__default",
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faThumbsUp}
      className={"metaItemIcon"}
    />
  ),
};

export { meta as default, DefaultMetaItem, TertiaryMetaItem, LikesMetaItem };
