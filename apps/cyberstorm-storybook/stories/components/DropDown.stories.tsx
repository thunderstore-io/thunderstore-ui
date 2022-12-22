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
} as ComponentMeta<typeof DropDown>;

const style = {};

const defaultArgs = {
  label: "Newest",
  rightIcon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"dropDownIcon"}
    />
  ),
};

const dropDownItems = [
  <DropDownItem
    key={1}
    label={"New"}
    leftIcon={
      <FontAwesomeIcon
        fixedWidth={true}
        icon={faStar}
        className={"dropDownItemIcon"}
      />
    }
  />,
  <DropDownItem
    key={2}
    label={"Hot"}
    leftIcon={
      <FontAwesomeIcon
        fixedWidth={true}
        icon={faFire}
        className={"dropDownItemIcon"}
      />
    }
  />,
  <DropDownItem
    key={3}
    label={"Top rated"}
    leftIcon={
      <FontAwesomeIcon
        fixedWidth={true}
        icon={faThumbsUp}
        className={"dropDownItemIcon"}
      />
    }
  />,
  <DropDownItem
    key={4}
    label={"A-Z"}
    leftIcon={
      <FontAwesomeIcon
        fixedWidth={true}
        icon={faArrowDownAZ}
        className={"dropDownItemIcon"}
      />
    }
  />,
  <DropDownItem
    key={5}
    label={"Z-A"}
    leftIcon={
      <FontAwesomeIcon
        fixedWidth={true}
        icon={faArrowUpAZ}
        className={"dropDownItemIcon"}
      />
    }
  />,
];

const Template: ComponentStory<typeof DropDown> = (args) => (
  <div style={style}>
    <DropDownItem
      key={5}
      label={"Z-A"}
      leftIcon={
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faArrowUpAZ}
          className={"dropDownItemIcon"}
        />
      }
    />
    <DropDown {...args} />
    <DropDown {...args} />
  </div>
);

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  defaultOpen: true,
  dropDownItems: dropDownItems,
  colorScheme: "defaultDark",
};

const MinimalDropDown = Template.bind({});
MinimalDropDown.args = defaultArgs;

export { meta as default, ReferenceDropDown, MinimalDropDown };
