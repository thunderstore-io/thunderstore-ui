import { StoryFn, Meta } from "@storybook/react";
import { Icon, Select, SelectProps } from "@thunderstore/cyberstorm";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faThumbsUp,
  faFire,
  faStar,
  faArrowDownAZ,
  faArrowUpAZ,
} from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Select",
  component: Select,
} as Meta<typeof Select>;

const options = [
  {
    value: "1",
    label: "Newest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faStar} />
      </Icon>
    ),
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faFire} />
      </Icon>
    ),
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faThumbsUp} />
      </Icon>
    ),
  },
  {
    value: "4",
    label: "A-Z",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faArrowDownAZ} />
      </Icon>
    ),
  },
  {
    value: "5",
    label: "Z-A",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faArrowUpAZ} />
      </Icon>
    ),
  },
];

const defaultArgs = {
  icon: (
    <Icon>
      <FontAwesomeIcon icon={faChevronDown} />
    </Icon>
  ),
  options: options,
};

type TemplateArgs = {
  props: SelectProps;
  defaultValue?: string;
};

const Template: StoryFn<TemplateArgs> = (args) => {
  const [value, setValue] = useState<string | undefined>(args.defaultValue);
  const props = {
    ...args.props,
    onChange: (x: string) => setValue(x),
    value,
  };
  delete args.defaultValue;

  return (
    <div>
      <div style={{ color: "white" }}>Value in state: {value}</div>
      <Select {...props} />
    </div>
  );
};

const ReferenceSelect = Template.bind({});
ReferenceSelect.args = {
  props: {
    ...defaultArgs,
    variant: "default",
    placeholder: "Sort by...",
  },
};

const PrimarySelect = Template.bind({});
PrimarySelect.args = {
  props: {
    ...defaultArgs,
    variant: "accent",
  },
  defaultValue: "2",
};

const EmptyOptionsSelect = Template.bind({});
EmptyOptionsSelect.args = {
  props: {
    ...defaultArgs,
    options: [],
    variant: "accent",
  },
};

const DefaultOpenSelect = Template.bind({});
DefaultOpenSelect.args = {
  props: {
    ...defaultArgs,
    defaultOpen: true,
    variant: "default",
    placeholder: "Sort by...",
  },
};

export {
  meta as default,
  ReferenceSelect,
  PrimarySelect,
  EmptyOptionsSelect,
  DefaultOpenSelect,
};
