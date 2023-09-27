import { StoryFn, Meta } from "@storybook/react";
import { Tag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faXmark } from "@fortawesome/pro-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Tag",
  component: Tag,
} as Meta<typeof Tag>;

const Template: StoryFn<typeof Tag> = (args) => (
  <div style={{ display: "flex", gap: "0.25em" }}>
    <Tag {...args} colorScheme="default" />
    <Tag {...args} colorScheme="static" />
    <Tag {...args} colorScheme="simple" />
    <Tag {...args} colorScheme="success" />
    <Tag {...args} colorScheme="removable" />
    <Tag {...args} colorScheme="info" />
  </div>
);

const MinimalTag = Template.bind({});
MinimalTag.args = {};

const DefaultTag = Template.bind({});
DefaultTag.args = {
  label: "tag",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

const IconOnlyTag = Template.bind({});
IconOnlyTag.args = {
  leftIcon: <FontAwesomeIcon fixedWidth icon={faTag} />,
};
const TextOnlyTag = Template.bind({});
TextOnlyTag.args = {
  label: "tag",
};

const SmallTag = Template.bind({});
SmallTag.args = {
  label: "tag",
  size: "small",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

const TinyTag = Template.bind({});
TinyTag.args = {
  label: "tag",
  size: "tiny",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

export {
  meta as default,
  MinimalTag,
  DefaultTag,
  IconOnlyTag,
  TextOnlyTag,
  SmallTag,
  TinyTag,
};
