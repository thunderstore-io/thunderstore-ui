import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CustomSelect,
  CustomSelectItem,
  SelectOption,
} from "@thunderstore/cyberstorm";
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
  title: "Cyberstorm/Components/CustomSelect",
  component: CustomSelect,
} as unknown as ComponentMeta<typeof CustomSelect>;

const defaultArgs = {
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="selectIcon" />
  ),
};

const options: SelectOption[] = [
  {
    value: "1",
    displayValue: "Newest",
    content: (
      <CustomSelectItem
        label="New"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faStar}
            className="selectItemIcon"
          />
        }
      />
    ),
  },
  {
    value: "2",
    displayValue: "Hottest",
    content: (
      <CustomSelectItem
        label="Hot"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faFire}
            className="selectItemIcon"
          />
        }
      />
    ),
  },
  {
    value: "3",
    displayValue: "Top rated",
    content: (
      <CustomSelectItem
        label="Top rated"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faThumbsUp}
            className="selectItemIcon"
          />
        }
      />
    ),
  },
  {
    value: "4",
    displayValue: "A-Z",
    content: (
      <CustomSelectItem
        label="Z-A"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faArrowDownAZ}
            className="selectItemIcon"
          />
        }
      />
    ),
  },
  {
    value: "5",
    displayValue: "Z-A",
    content: (
      <CustomSelectItem
        label="Z-A"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faArrowUpAZ}
            className="selectItemIcon"
          />
        }
      />
    ),
  },
];

const Template: ComponentStory<typeof CustomSelect> = (args) => {
  const [value, setValue] = useState(
    args.defaultValue ??
      options?.values().next().value?.value ?? // Default to first item if defaultValue isn't set
      ""
  );
  args.onChange = setValue;
  args.value = value;
  delete args.defaultValue;

  return (
    <div>
      <div style={{ color: "white" }}>Value in state: {value}</div>
      <CustomSelect {...args} />
    </div>
  );
};

const ReferenceSelect = Template.bind({});
ReferenceSelect.args = {
  ...defaultArgs,
  options: options,
  colorScheme: "default",
};

const DarkSelect = Template.bind({});
DarkSelect.args = {
  ...defaultArgs,
  defaultValue: "3",
  options: options,
  colorScheme: "defaultDark",
};

const PrimarySelect = Template.bind({});
PrimarySelect.args = {
  ...defaultArgs,
  defaultValue: "2",
  options: options,
  colorScheme: "primary",
};

const MinimalSelect = Template.bind({});
MinimalSelect.args = defaultArgs;

export {
  meta as default,
  ReferenceSelect,
  MinimalSelect,
  DarkSelect,
  PrimarySelect,
};
