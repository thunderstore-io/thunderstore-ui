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

const DangerButton = Template.bind({});
DangerButton.args = {
  label: "Danger",
  buttonStyle: "danger",
  leftIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
};

const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: "Primary",
  buttonStyle: "primary",
  leftIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faChevronDown} />,
};

const DefaultButton = Template.bind({});
DefaultButton.args = {};

export { meta as default, DangerButton, DefaultButton, PrimaryButton };
