import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tag } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faFaceDizzy } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>;

const defaultArgs = {
  label: "-",
};

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

const DefaultTag = Template.bind({});
DefaultTag.args = { ...defaultArgs };

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

export { meta as default, DefaultTag, IconTag };
