import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  DropDown,
  DropDownItem,
  DropDownOption,
  DropDownOptions,
} from "@thunderstore/cyberstorm";
import React from "react";
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
  title: "Cyberstorm/Components/DropDown",
  component: DropDown,
} as unknown as ComponentMeta<typeof DropDown>;

const defaultArgs = {
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="dropDownIcon" />
  ),
};

const options: DropDownOption[] = [
  {
    value: 1,
    displayValue: "Newest",
    content: (
      <DropDownItem
        label="New"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faStar}
            className="dropDownItemIcon"
          />
        }
      />
    ),
  },
  {
    value: 2,
    displayValue: "Hottest",
    content: (
      <DropDownItem
        label="Hot"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faFire}
            className="dropDownItemIcon"
          />
        }
      />
    ),
  },
  {
    value: 3,
    displayValue: "Top rated",
    content: (
      <DropDownItem
        label="Top rated"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faThumbsUp}
            className="dropDownItemIcon"
          />
        }
      />
    ),
  },
  {
    value: 4,
    displayValue: "A-Z",
    content: (
      <DropDownItem
        label="Z-A"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faArrowDownAZ}
            className="dropDownItemIcon"
          />
        }
      />
    ),
  },
  {
    value: 5,
    displayValue: "Z-A",
    content: (
      <DropDownItem
        label="Z-A"
        leftIcon={
          <FontAwesomeIcon
            fixedWidth
            icon={faArrowUpAZ}
            className="dropDownItemIcon"
          />
        }
      />
    ),
  },
];

const Template: ComponentStory<typeof DropDown> = (args) => (
  <DropDown {...args} />
);

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  label: "Newest",
  options: options,
  colorScheme: "default",
};

const DarkDropDown = Template.bind({});
DarkDropDown.args = {
  ...defaultArgs,
  defaultValue: 3,
  label: "Newest",
  options: options,
  colorScheme: "defaultDark",
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  defaultValue: 2,
  label: "Newest",
  options: options,
  colorScheme: "primary",
};

const MinimalDropDown = Template.bind({});
MinimalDropDown.args = defaultArgs;

export {
  meta as default,
  ReferenceDropDown,
  MinimalDropDown,
  DarkDropDown,
  PrimaryDropDown,
};
