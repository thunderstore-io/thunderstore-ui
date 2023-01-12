import { ComponentStory, ComponentMeta } from "@storybook/react";
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

const meta = {
  title: "Cyberstorm/Components/Select",
  component: Select,
} as unknown as ComponentMeta<typeof Select>;

const options: SelectOption[] = [
  {
    value: "1",
    label: "Newest",
    leftIcon: (
      <FontAwesomeIcon fixedWidth icon={faStar} className="selectItemIcon" />
    ),
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: (
      <FontAwesomeIcon fixedWidth icon={faFire} className="selectItemIcon" />
    ),
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: (
      <FontAwesomeIcon
        fixedWidth
        icon={faThumbsUp}
        className="selectItemIcon"
      />
    ),
  },
  {
    value: "4",
    label: "A-Z",
    leftIcon: (
      <FontAwesomeIcon
        fixedWidth
        icon={faArrowDownAZ}
        className="selectItemIcon"
      />
    ),
  },
  {
    value: "5",
    label: "Z-A",
    leftIcon: (
      <FontAwesomeIcon
        fixedWidth
        icon={faArrowUpAZ}
        className="selectItemIcon"
      />
    ),
  },
];

const defaultArgs = {
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="selectIcon" />
  ),
  options: options,
};

const Template: ComponentStory<typeof Select> = (args) => {
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

export {
  meta as default,
  ReferenceSelect,
  DarkSelect,
  PrimarySelect,
  EmptyOptionsSelect,
};
