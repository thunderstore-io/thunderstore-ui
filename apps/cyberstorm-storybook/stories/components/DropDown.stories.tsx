import { StoryFn, Meta } from "@storybook/react";
import {
  Button,
  DropDown,
  Icon,
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

const meta = {
  title: "Cyberstorm/Components/DropDown",
  component: DropDown,
} as Meta<typeof DropDown>;

const defaultArgs = {
  trigger: (
    <Button.Root>
      <Button.ButtonLabel>Developers</Button.ButtonLabel>
      <Button.ButtonIcon>
        <Icon>
          <FontAwesomeIcon icon={faChevronDown} />
        </Icon>
      </Button.ButtonIcon>
    </Button.Root>
  ),
};

const content: ReactElement<MenuItemProps>[] = [
  <MenuItem.Root key={1}>
    <MenuItem.Icon>
      <Icon>
        <FontAwesomeIcon icon={faStar} />
      </Icon>
    </MenuItem.Icon>
    <MenuItem.Label>New</MenuItem.Label>
  </MenuItem.Root>,
  <MenuItem.Root key={2}>
    <MenuItem.Icon>
      <Icon>
        <FontAwesomeIcon icon={faThumbtack} />
      </Icon>
    </MenuItem.Icon>
    <MenuItem.Label>New</MenuItem.Label>
  </MenuItem.Root>,
  <Button.Root style={{ minWidth: "100%" }} key={3}>
    <Button.ButtonLabel>Nabbula</Button.ButtonLabel>
    <Button.ButtonIcon>
      <Icon>
        <FontAwesomeIcon icon={faSkull} />
      </Icon>
    </Button.ButtonIcon>
  </Button.Root>,
];

const Template: StoryFn<typeof DropDown> = (args) => <DropDown {...args} />;

const ReferenceDropDown = Template.bind({});
ReferenceDropDown.args = {
  ...defaultArgs,
  content: content,
  colorScheme: "default",
};

const PrimaryDropDown = Template.bind({});
PrimaryDropDown.args = {
  ...defaultArgs,
  content: content,
  colorScheme: "accent",
};

const TriggerColorDropDown = Template.bind({});
TriggerColorDropDown.args = {
  ...defaultArgs,
  triggerColorScheme: "accent",
  content: content,
  colorScheme: "default",
};

const TagTriggerDropDown = Template.bind({});
TagTriggerDropDown.args = {
  ...defaultArgs,
  content: content,
  trigger: <Tag label={"I'm a trigger"} />,
};

const MinimalDropDown = Template.bind({});
MinimalDropDown.args = defaultArgs;

const DefaultOpenDropDown = Template.bind({});
DefaultOpenDropDown.args = {
  ...defaultArgs,
  content: content,
  defaultOpen: true,
  colorScheme: "default",
};

export {
  meta as default,
  ReferenceDropDown,
  MinimalDropDown,
  PrimaryDropDown,
  TagTriggerDropDown,
  DefaultOpenDropDown,
  TriggerColorDropDown,
};
