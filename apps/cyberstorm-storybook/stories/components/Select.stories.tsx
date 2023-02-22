import { StoryFn, Meta } from "@storybook/react";
import { Select, SelectOption } from "@thunderstore/cyberstorm";
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

const Template: StoryFn<typeof Select> = (args) => {
  const [value, setValue] = useState(args.defaultValue ?? null);
  args.onChange = setValue;
  args.value = value;
  delete args.defaultValue;

  return (
    <div>
      <div style={{ color: "white" }}>Value in state: {value}</div>
      <Select {...args} />
    </div>
  );
};

const ReferenceSelect = Template.bind({});
ReferenceSelect.args = {
  ...defaultArgs,
  colorScheme: "default",
  placeholder: "Sort by...",
};

const DarkSelect = Template.bind({});
DarkSelect.args = {
  ...defaultArgs,
  defaultValue: "3",
  colorScheme: "defaultDark",
};

const PrimarySelect = Template.bind({});
PrimarySelect.args = {
  ...defaultArgs,
  defaultValue: "2",
  colorScheme: "primary",
};

const EmptyOptionsSelect = Template.bind({});
EmptyOptionsSelect.args = {
  ...defaultArgs,
  options: [],
  colorScheme: "primary",
};

const DefaultOpenSelect = Template.bind({});
DefaultOpenSelect.args = {
  ...defaultArgs,
  defaultOpen: true,
  colorScheme: "default",
  placeholder: "Sort by...",
};

export {
  ReferenceSelect,
  DarkSelect,
  PrimarySelect,
  EmptyOptionsSelect,
  DefaultOpenSelect,
};
