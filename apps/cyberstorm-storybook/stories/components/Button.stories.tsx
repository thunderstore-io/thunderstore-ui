import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const defaultArgs = {
  label: "Categories",
  rightIcon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"buttonIcon"}
    />
  ),
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const DefaultButton = Template.bind({});
DefaultButton.args = defaultArgs;

const DefaultDarkButton = Template.bind({});
DefaultDarkButton.args = { ...defaultArgs, buttonStyle: "button__defaultDark" };

const PrimaryButton = Template.bind({});
PrimaryButton.args = { ...defaultArgs, buttonStyle: "button__primary" };

const DangerButton = Template.bind({});
DangerButton.args = {
  ...defaultArgs,
  leftIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
  rightIcon: null,
  buttonStyle: "button__danger",
  onClick: () => {
    alert("Danger button clicked");
  },
};

const DefaultButtonWithBorder = Template.bind({});
DefaultButtonWithBorder.args = {
  ...defaultArgs,
  buttonStyle: "button__defaultWithBorder",
};

const SpecialGreenButton = Template.bind({});
SpecialGreenButton.args = {
  ...defaultArgs,
  buttonStyle: "button__specialGreen",
};

const SpecialPurpleButton = Template.bind({});
SpecialPurpleButton.args = {
  ...defaultArgs,
  buttonStyle: "button__specialPurple",
};

export {
  meta as default,
  DefaultButton,
  DefaultDarkButton,
  PrimaryButton,
  DangerButton,
  DefaultButtonWithBorder,
  SpecialGreenButton,
  SpecialPurpleButton,
};
