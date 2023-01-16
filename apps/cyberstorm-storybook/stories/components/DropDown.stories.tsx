import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Button,
  DropDown,
  SelectItem,
  SelectItemProps,
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

const meta = {
  title: "Cyberstorm/Components/DropDown",
  component: DropDown,
} as unknown as ComponentMeta<typeof DropDown>;

const defaultArgs = {
  trigger: (
    <Button
      label="Developers"
      rightIcon={<FontAwesomeIcon fixedWidth icon={faChevronDown} />}
    />
  ),
};

const content: ReactElement<SelectItemProps>[] = [
  <SelectItem
    key={1}
    label="New"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faStar} />}
  />,
  <SelectItem
    key={2}
    label="New"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
  />,
  <Button
    key={3}
    label="Nabbula"
    leftIcon={<FontAwesomeIcon fixedWidth icon={faSkull} />}
  />,
  <DropDown
    key={5}
    label="Another one"
    content={[<Button key={1} label="Namiska" />]}
    trigger={<Button label="dropdown"></Button>}
  />,
];

const Template: ComponentStory<typeof DropDown> = (args) => (
  <DropDown {...args} />
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
  trigger: <Tag />,
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
  meta as default,
  ReferenceDropDown,
  MinimalDropDown,
  DarkDropDown,
  PrimaryDropDown,
  TagTriggerDropDown,
  DefaultOpenDropDown,
  TriggerColorDropDown,
};
