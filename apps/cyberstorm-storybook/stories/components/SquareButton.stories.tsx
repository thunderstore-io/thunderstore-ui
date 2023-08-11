import { StoryFn, Meta } from "@storybook/react";
import { SquareButton } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/SquareButton",
  component: SquareButton,
} as Meta;

const defaultArgs = {
  label: "Categories",
  icon: <FontAwesomeIcon fixedWidth icon={faSkull} />,
};

const Template: StoryFn<typeof SquareButton> = (args) => (
  <SquareButton {...args} />
);

const DefaultSquareButton = Template.bind({});
DefaultSquareButton.args = defaultArgs;

const PrimarySquareButton = Template.bind({});
PrimarySquareButton.args = { ...defaultArgs, colorScheme: "primary" };

const DangerSquareButton = Template.bind({});
DangerSquareButton.args = {
  ...defaultArgs,
  icon: <FontAwesomeIcon fixedWidth icon={faSkull} />,
  colorScheme: "danger",
  onClick: () => {
    alert("Danger button clicked");
  },
};

const SpecialGreenSquareButton = Template.bind({});
SpecialGreenSquareButton.args = {
  ...defaultArgs,
  colorScheme: "specialGreen",
};

const SpecialPurpleSquareButton = Template.bind({});
SpecialPurpleSquareButton.args = {
  ...defaultArgs,
  colorScheme: "specialPurple",
};

export {
  DefaultSquareButton,
  PrimarySquareButton,
  DangerSquareButton,
  SpecialGreenSquareButton,
  SpecialPurpleSquareButton,
};
