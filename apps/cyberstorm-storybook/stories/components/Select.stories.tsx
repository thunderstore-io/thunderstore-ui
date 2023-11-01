import { StoryFn, Meta } from "@storybook/react";
import { Select, SelectProps } from "@thunderstore/cyberstorm";
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
    leftIcon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: <FontAwesomeIcon icon={faFire} />,
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: <FontAwesomeIcon icon={faThumbsUp} />,
  },
  {
    value: "4",
    label: "A-Z",
    leftIcon: <FontAwesomeIcon icon={faArrowDownAZ} />,
  },
  {
    value: "5",
    label: "Z-A",
    leftIcon: <FontAwesomeIcon icon={faArrowUpAZ} />,
  },
];

const defaultArgs = {
  icon: <FontAwesomeIcon icon={faChevronDown} />,
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
