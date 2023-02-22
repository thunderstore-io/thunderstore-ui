import { StoryFn, Meta } from "@storybook/react";
import {
  Button,
  DropDown,
  MenuItem,
  MenuItemProps,
  Tag,
} from "@thunderstore/cyberstorm";
import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faStar,
  faThumbtack,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/DropDown",
  component: DropDown,
} as Meta;

const defaultArgs = {
  trigger: (
    <Button
      label="Developers"
      rightIcon={<FontAwesomeIcon fixedWidth icon={faChevronDown} />}
    />
  ),
};

const content: ReactElement<MenuItemProps>[] = [
  <MenuItem
    key={1}
    label="New"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faStar} />}
  />,
  <MenuItem
    key={2}
    label="New"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
  />,
  <Button
    style={{ minWidth: "100%" }}
    key={3}
    label="Nabbula"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faSkull} />}
  />,
];

const Template: StoryFn<typeof DropDown> = (args) => <DropDown {...args} />;

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

const TriggerColorDropDown = Template.bind({});
TriggerColorDropDown.args = {
  ...defaultArgs,
  triggerColorScheme: "primary",
  content: content,
  label: "Click me",
  colorScheme: "default",
};

const TagTriggerDropDown = Template.bind({});
TagTriggerDropDown.args = {
  ...defaultArgs,
  content: content,
  label: "Open",
  trigger: <Tag label={"I'm a trigger"} />,
};

const MinimalDropDown = Template.bind({});
MinimalDropDown.args = defaultArgs;

const DefaultOpenDropDown = Template.bind({});
DefaultOpenDropDown.args = {
  ...defaultArgs,
  content: content,
  defaultOpen: true,
  label: "Default open",
  colorScheme: "default",
};

export {
  ReferenceDropDown,
  MinimalDropDown,
  DarkDropDown,
  PrimaryDropDown,
  TagTriggerDropDown,
  DefaultOpenDropDown,
  TriggerColorDropDown,
};
