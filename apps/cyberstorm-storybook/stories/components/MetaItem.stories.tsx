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
  metaItemStyle: "default",
};

const Template: ComponentStory<typeof MetaItem> = (args) => (
  <MetaItem {...args} />
);

const DefaultMetaItem = Template.bind({});
DefaultMetaItem.args = {
  ...defaultArgs,
};

const GreenMetaItem = Template.bind({});
GreenMetaItem.args = {
  ...defaultArgs,
  label: "Gigamies5000",
  metaItemStyle: "green",
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
  metaItemStyle: "default",
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faThumbsUp}
      className={"metaItemIcon"}
    />
  ),
};

export { meta as default, DefaultMetaItem, GreenMetaItem, LikesMetaItem };
