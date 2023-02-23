import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/Button",
  component: Button,
} as Meta;

const defaultArgs = {
  label: "Categories",
  rightIcon: <FontAwesomeIcon fixedWidth icon={faChevronDown} />,
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

const DefaultDarkButton = Template.bind({});
DefaultDarkButton.args = { ...defaultArgs, colorScheme: "defaultDark" };

const PrimaryButton = Template.bind({});
PrimaryButton.args = { ...defaultArgs, colorScheme: "primary" };

const DangerButton = Template.bind({});
DangerButton.args = {
  ...defaultArgs,
  leftIcon: <FontAwesomeIcon fixedWidth icon={faSkull} />,
  rightIcon: null,
  colorScheme: "danger",
  onClick: () => {
    alert("Danger button clicked");
  },
};

const DefaultButtonWithBorder = Template.bind({});
DefaultButtonWithBorder.args = {
  ...defaultArgs,
  colorScheme: "defaultWithBorder",
};

const SpecialGreenButton = Template.bind({});
SpecialGreenButton.args = {
  ...defaultArgs,
  colorScheme: "specialGreen",
};

const SpecialPurpleButton = Template.bind({});
SpecialPurpleButton.args = {
  ...defaultArgs,
  colorScheme: "specialPurple",
};

export {
  DefaultButton,
  DefaultDarkButton,
  PrimaryButton,
  DangerButton,
  DefaultButtonWithBorder,
  SpecialGreenButton,
  SpecialPurpleButton,
};
