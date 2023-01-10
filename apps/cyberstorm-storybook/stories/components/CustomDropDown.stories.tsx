import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Button,
  CustomDropDown,
  CustomSelectItem,
  Tag,
} from "@thunderstore/cyberstorm";
import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faStar,
  faThumbtack,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/CustomDropDown",
  component: CustomDropDown,
} as unknown as ComponentMeta<typeof CustomDropDown>;

const defaultArgs = {
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="dropDownIcon" />
  ),
};

const content: ReactNode[] = [
  <CustomSelectItem
    key={1}
    label="New"
    leftIcon={
      <FontAwesomeIcon
        fixedWidth
        icon={faStar}
        className="dropDownSelectItemIcon"
      />
    }
  />,
  <CustomSelectItem
    key={2}
    label="New"
    leftIcon={
      <FontAwesomeIcon
        fixedWidth
        icon={faThumbtack}
        className="dropDownSelectItemIcon"
      />
    }
  />,
  <Button
    key={3}
    label="Nabbula"
    leftIcon={
      <FontAwesomeIcon
        fixedWidth
        icon={faSkull}
        className="dropDownButtonIcon"
      />
    }
  />,
  <Tag key={4} label="tag" />,
  <CustomDropDown
    key={5}
    label="Another one"
    content={[<Button key={1} label="Namiska" />]}
  />,
];

const Template: ComponentStory<typeof CustomDropDown> = (args) => (
  <CustomDropDown {...args} />
);

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  content: content,
  label: "Settings",
  colorScheme: "default",
};

const DarkDropDown = Template.bind({});
DarkDropDown.args = {
  ...defaultArgs,
  content: content,
  label: "More ...",
  colorScheme: "defaultDark",
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  content: content,
  label: "Click me",
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
