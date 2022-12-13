import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faFaceDizzy,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>;

const defaultArgs = {};

const Template: ComponentStory<typeof Tag> = (args) => (
  <div style={{ display: "flex", gap: "0.25em" }}>
    <Tag {...args} />
    <Tag {...args} />
    <Tag {...args} />
  </div>
);

const MinimalTag = Template.bind({});
MinimalTag.args = { ...defaultArgs };

const ReferenceTag = Template.bind({});
ReferenceTag.args = {
  ...defaultArgs,
  label: "tag",
  isRemovable: true,
  rightIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconRight"
      fixedWidth={true}
      icon={faXmark}
    />
  ),
};

const IconTag = Template.bind({});
IconTag.args = {
  ...defaultArgs,
  label: "tag",
  leftIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconLeft"
      fixedWidth={true}
      icon={faFaceDizzy}
    />
  ),
  rightIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconRight"
      fixedWidth={true}
      icon={faFlag}
    />
  ),
};

const SmallTag = Template.bind({});
SmallTag.args = {
  ...defaultArgs,
  label: "tag",
  size: "small",
  rightIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconRight"
      fixedWidth={true}
      icon={faXmark}
    />
  ),
};

export { meta as default, MinimalTag, ReferenceTag, IconTag, SmallTag };
