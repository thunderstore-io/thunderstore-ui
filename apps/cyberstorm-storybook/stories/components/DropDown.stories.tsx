import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DropDown, DropDownItem } from "@thunderstore/cyberstorm";
import React, { ReactNode } from "react";
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

const style = {};

const defaultArgs = {
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"dropDownIcon"}
    />
  ),
};

const dropDownData = [
  {
    label: "Newest",
    value: 1,
    reactElement: (
      <DropDownItem
        label={"New"}
        leftIcon={
          <FontAwesomeIcon
            fixedWidth={true}
            icon={faStar}
            className={"dropDownItemIcon"}
          />
        }
      />
    ),
  },
  {
    label: "Hottest",
    value: 2,
    reactElement: (
      <DropDownItem
        label={"Hot"}
        leftIcon={
          <FontAwesomeIcon
            fixedWidth={true}
            icon={faFire}
            className={"dropDownItemIcon"}
          />
        }
      />
    ),
  },
  {
    label: "Top rated",
    value: 3,
    reactElement: (
      <DropDownItem
        label={"Top rated"}
        leftIcon={
          <FontAwesomeIcon
            fixedWidth={true}
            icon={faThumbsUp}
            className={"dropDownItemIcon"}
          />
        }
      />
    ),
  },
  {
    label: "A-Z",
    value: 4,
    reactElement: (
      <DropDownItem
        label={"A-Z"}
        leftIcon={
          <FontAwesomeIcon
            fixedWidth={true}
            icon={faArrowDownAZ}
            className={"dropDownItemIcon"}
          />
        }
      />
    ),
  },
  {
    label: "Z-A",
    value: 5,
    reactElement: (
      <DropDownItem
        label={"Z-A"}
        leftIcon={
          <FontAwesomeIcon
            fixedWidth={true}
            icon={faArrowUpAZ}
            className={"dropDownItemIcon"}
          />
        }
      />
    ),
  },
];

const Template: ComponentStory<typeof DropDown> = (args) => (
  <div style={style}>
    <DropDown {...args} />
  </div>
);

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  label: "Newest",
  dropDownData: dropDownData,
  colorScheme: "default",
};

const DarkDropDown = Template.bind({});
DarkDropDown.args = {
  ...defaultArgs,
  defaultValue: 3,
  label: "Newest",
  dropDownData: dropDownData,
  colorScheme: "defaultDark",
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  label: "Newest",
  dropDownData: dropDownData,
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
