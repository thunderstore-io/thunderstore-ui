import { StoryFn, Meta } from "@storybook/react";
import { Tag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faFaceDizzy,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/Title",
  component: Tag,
} as Meta;

const Template: StoryFn<typeof Tag> = (args) => (
  <div style={{ display: "flex", gap: "0.25em" }}>
    <Tag {...args} />
    <Tag {...args} />
    <Tag {...args} />
  </div>
);

const MinimalTag = Template.bind({});
MinimalTag.args = {};

const ReferenceTag = Template.bind({});
ReferenceTag.args = {
  label: "tag",
  isRemovable: true,
  rightIcon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

const IconTag = Template.bind({});
IconTag.args = {
  label: "tag",
  leftIcon: <FontAwesomeIcon fixedWidth icon={faFaceDizzy} />,
  rightIcon: <FontAwesomeIcon fixedWidth icon={faFlag} />,
};

const SmallTag = Template.bind({});
SmallTag.args = {
  label: "tag",
  size: "small",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

export { MinimalTag, ReferenceTag, IconTag, SmallTag };
