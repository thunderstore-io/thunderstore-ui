import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DropDownItem } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/DropDownItem",
  component: DropDownItem,
} as ComponentMeta<typeof DropDownItem>;

const style = {};

const defaultArgs = {
  label: "A-Z",
  leftIcon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faArrowDownAZ}
      className={"dropDownItemIcon"}
    />
  ),
};

const Template: ComponentStory<typeof DropDownItem> = (args) => (
  <div style={style}>
    <DropDownItem {...args} />
  </div>
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
MinimalDropDownItem.args = defaultArgs;

export {
  meta as default,
  ReferenceDropDownItem,
  MinimalDropDownItem,
  DarkDropDownItem,
  PrimaryDropDownItem,
};
