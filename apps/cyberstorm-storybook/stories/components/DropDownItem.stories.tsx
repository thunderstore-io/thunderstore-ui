import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DropDownItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/DropDownItem",
  component: DropDownItem,
} as ComponentMeta<typeof DropDownItem>;

const defaultArgs = {
  label: "A-Z",
  leftIcon: (
    <FontAwesomeIcon
      fixedWidth
      icon={faArrowDownAZ}
      className="dropDownItemIcon"
    />
  ),
};

const Template: ComponentStory<typeof DropDownItem> = (args) => (
  <DropDownItem {...args} />
);

const ReferenceDropDownItem = Template.bind({});
ReferenceDropDownItem.args = {
  ...defaultArgs,
  colorScheme: "default",
};

const DarkDropDownItem = Template.bind({});
DarkDropDownItem.args = {
  ...defaultArgs,
  colorScheme: "defaultDark",
};

const PrimaryDropDownItem = Template.bind({});
PrimaryDropDownItem.args = {
  ...defaultArgs,
  colorScheme: "primary",
};

const MinimalDropDownItem = Template.bind({});
MinimalDropDownItem.args = {};

const ExtremeDropDownItem = Template.bind({});
ExtremeDropDownItem.args = {
  ...defaultArgs,
  colorScheme: "default",
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis nibh commodo cursus. Nulla facilisi.",
  rightIcon: (
    <FontAwesomeIcon
      fixedWidth
      icon={faArrowDownAZ}
      className="dropDownItemIcon"
    />
  ),
};

export {
  meta as default,
  ReferenceDropDownItem,
  MinimalDropDownItem,
  DarkDropDownItem,
  PrimaryDropDownItem,
  ExtremeDropDownItem,
};
