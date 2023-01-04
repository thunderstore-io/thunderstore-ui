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

const options: DropDownOptions = new Map<number | string, DropDownOption>([
  [
    1,
    {
      label: "Newest",
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
  ],
  [
    2,
    {
      label: "Hottest",
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
  ],
  [
    3,
    {
      label: "Top rated",
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
  ],
  [
    "ascending",
    {
      label: "A-Z",
      content: (
        <DropDownItem
          label="A-Z"
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
  ],
  [
    "descending",
    {
      label: "Z-A",
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
  ],
]);

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
  defaultSelectedOptionKey: 3,
  label: "Newest",
  options: options,
  colorScheme: "defaultDark",
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  defaultSelectedOptionKey: "descending",
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
