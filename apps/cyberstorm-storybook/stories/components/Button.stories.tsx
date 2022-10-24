import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const DefaultButton = Template.bind({});
DefaultButton.args = {
  label: "Categories",
  buttonStyle: "default",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const DefaultDarkButton = Template.bind({});
DefaultDarkButton.args = {
  label: "Categories",
  buttonStyle: "defaultDark",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: "Categories",
  buttonStyle: "primary",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const DangerButton = Template.bind({});
DangerButton.args = {
  label: "Danger",
  buttonStyle: "danger",
  leftIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
  onClick: () => {
    alert("Danger button clicked");
  },
};

const DefaultButtonWithBorder = Template.bind({});
DefaultButtonWithBorder.args = {
  label: "Categories",
  buttonStyle: "defaultWithBorder",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const SpecialGreenButton = Template.bind({});
SpecialGreenButton.args = {
  label: "Categories",
  buttonStyle: "specialGreen",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const SpecialPurpleButton = Template.bind({});
SpecialPurpleButton.args = {
  label: "Categories",
  buttonStyle: "specialPurple",
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
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
