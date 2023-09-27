import { StoryFn, Meta } from "@storybook/react";
import { MenuItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/MenuItem",
  component: MenuItem,
} as Meta<typeof MenuItem>;

const defaultArgs = {
  label: "A-Z",
  leftIcon: <FontAwesomeIcon fixedWidth icon={faArrowDownAZ} />,
};

const Template: StoryFn<typeof MenuItem> = (args) => <MenuItem {...args} />;

const ReferenceMenuItem = Template.bind({});
ReferenceMenuItem.args = {
  ...defaultArgs,
  colorScheme: "default",
};

const PrimaryMenuItem = Template.bind({});
PrimaryMenuItem.args = {
  ...defaultArgs,
  colorScheme: "accent",
};

const MinimalMenuItem = Template.bind({});
MinimalMenuItem.args = {};

const ExtremeMenuItem = Template.bind({});
ExtremeMenuItem.args = {
  ...defaultArgs,
  colorScheme: "default",
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis nibh commodo cursus. Nulla facilisi.",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faArrowDownAZ} />,
};

export {
  meta as default,
  ReferenceMenuItem,
  MinimalMenuItem,
  PrimaryMenuItem,
  ExtremeMenuItem,
};
