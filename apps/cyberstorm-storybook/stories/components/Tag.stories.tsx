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

const defaultArgs = {
  label: "-",
};

const Template: ComponentStory<typeof Tag> = (args) => (
  <div style={{ display: "flex", gap: "0.25em" }}>
    <Tag {...args} />
    <Tag {...args} />
    <Tag {...args} />
  </div>
);

const DefaultTag = Template.bind({});
DefaultTag.args = { ...defaultArgs };

const DesignTag = Template.bind({});
DesignTag.args = {
  ...defaultArgs,
  label: "tag",
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

const LargeTag = Template.bind({});
LargeTag.args = {
  ...defaultArgs,
  label: "tag",
  tagSize: "large",
  rightIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconRight"
      fixedWidth={true}
      icon={faXmark}
    />
  ),
};

const SmallTag = Template.bind({});
SmallTag.args = {
  ...defaultArgs,
  label: "tag",
  tagSize: "small",
  rightIcon: (
    <FontAwesomeIcon
      className="tagIcon tagIconRight"
      fixedWidth={true}
      icon={faXmark}
    />
  ),
};

export { meta as default, DefaultTag, DesignTag, IconTag, LargeTag, SmallTag };
