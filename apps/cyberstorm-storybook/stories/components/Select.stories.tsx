import { StoryFn, Meta } from "@storybook/react";
import { Select, SelectOption, SelectProps } from "@thunderstore/cyberstorm";
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

export default {
  title: "Cyberstorm/Components/Select",
  component: Select,
} as Meta<typeof Select>;

const options: SelectOption[] = [
  {
    value: "1",
    label: "Newest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faStar} />,
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faFire} />,
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faThumbsUp} />,
  },
  {
    value: "4",
    label: "A-Z",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faArrowDownAZ} />,
  },
  {
    value: "5",
    label: "Z-A",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faArrowUpAZ} />,
  },
];

const defaultArgs = {
  icon: <FontAwesomeIcon fixedWidth icon={faChevronDown} />,
  options: options,
};

type TemplateArgs = {
  props: SelectProps;
  defaultValue?: string;
};
const Template: StoryFn<TemplateArgs> = (args) => {
  const [value, setValue] = useState<string | undefined>(args.defaultValue);
  const props: SelectProps = {
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
    colorScheme: "default",
    placeholder: "Sort by...",
  },
};

const DarkSelect = Template.bind({});
DarkSelect.args = {
  props: {
    ...defaultArgs,
    colorScheme: "defaultDark",
  },
  defaultValue: "3",
};

const PrimarySelect = Template.bind({});
PrimarySelect.args = {
  props: {
    ...defaultArgs,
    colorScheme: "primary",
  },
  defaultValue: "2",
};

const EmptyOptionsSelect = Template.bind({});
EmptyOptionsSelect.args = {
  props: {
    ...defaultArgs,
    options: [],
    colorScheme: "primary",
  },
};

const DefaultOpenSelect = Template.bind({});
DefaultOpenSelect.args = {
  props: {
    ...defaultArgs,
    defaultOpen: true,
    colorScheme: "default",
    placeholder: "Sort by...",
  },
};

export {
  ReferenceSelect,
  DarkSelect,
  PrimarySelect,
  EmptyOptionsSelect,
  DefaultOpenSelect,
};
