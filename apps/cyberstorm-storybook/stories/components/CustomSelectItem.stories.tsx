import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CustomSelectItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/CustomSelectItem",
  component: CustomSelectItem,
} as ComponentMeta<typeof CustomSelectItem>;

const defaultArgs = {
  label: "A-Z",
  leftIcon: (
    <FontAwesomeIcon
      fixedWidth
      icon={faArrowDownAZ}
      className="selectItemIcon"
    />
  ),
};

const Template: ComponentStory<typeof CustomSelectItem> = (args) => (
  <CustomSelectItem {...args} />
);

const ReferenceSelectItem = Template.bind({});
ReferenceSelectItem.args = {
  ...defaultArgs,
  colorScheme: "default",
};

const DarkSelectItem = Template.bind({});
DarkSelectItem.args = {
  ...defaultArgs,
  colorScheme: "defaultDark",
};

const PrimarySelectItem = Template.bind({});
PrimarySelectItem.args = {
  ...defaultArgs,
  colorScheme: "primary",
};

const MinimalSelectItem = Template.bind({});
MinimalSelectItem.args = {};

const ExtremeSelectItem = Template.bind({});
ExtremeSelectItem.args = {
  ...defaultArgs,
  colorScheme: "default",
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit. Donec vel leo neque. Vivamus vehicula enim quis nibh commodo cursus. Nulla facilisi.",
  rightIcon: (
    <FontAwesomeIcon
      fixedWidth
      icon={faArrowDownAZ}
      className="selectItemIcon"
    />
  ),
};

export {
  meta as default,
  ReferenceSelectItem,
  MinimalSelectItem,
  DarkSelectItem,
  PrimarySelectItem,
  ExtremeSelectItem,
};
