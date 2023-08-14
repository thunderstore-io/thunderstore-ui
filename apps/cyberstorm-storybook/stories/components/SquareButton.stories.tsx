import { StoryFn, ComponentMeta } from "@storybook/react";
import { SquareButton, SquarePlainButton } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/SquareButton",
  component: SquareButton,
} as ComponentMeta<typeof SquareButton>;

const defaultArgs = {
  tooltipText: "tooltip text",
  icon: <FontAwesomeIcon fixedWidth icon={faSkull} />,
};

const DefaultTemplate: StoryFn<typeof SquareButton> = (args) => (
  <div>
    <SquareButton colorScheme="danger" {...args} />
    <SquareButton colorScheme="default" {...args} />
    <SquareButton colorScheme="primary" {...args} />
    <SquareButton colorScheme="accent" {...args} />
    <SquareButton colorScheme="tertiary" {...args} />
    <SquareButton colorScheme="fancyAccent" {...args} />
    <SquareButton colorScheme="success" {...args} />
    <SquareButton colorScheme="warning" {...args} />
    <SquareButton colorScheme="specialGreen" {...args} />
    <SquareButton colorScheme="specialPurple" {...args} />
    <SquareButton colorScheme="transparentDanger" {...args} />
    <SquareButton colorScheme="transparentDefault" {...args} />
    <SquareButton colorScheme="transparentTertiary" {...args} />
    <SquareButton colorScheme="transparentAccent" {...args} />
    <SquareButton colorScheme="transparentPrimary" {...args} />
  </div>
);

const PlainTemplate: StoryFn<typeof SquarePlainButton> = (args) => (
  <div>
    <SquarePlainButton colorScheme="danger" {...args} />
    <SquarePlainButton colorScheme="default" {...args} />
    <SquarePlainButton colorScheme="primary" {...args} />
    <SquarePlainButton colorScheme="accent" {...args} />
    <SquarePlainButton colorScheme="tertiary" {...args} />
    <SquarePlainButton colorScheme="fancyAccent" {...args} />
    <SquarePlainButton colorScheme="success" {...args} />
    <SquarePlainButton colorScheme="warning" {...args} />
    <SquarePlainButton colorScheme="specialGreen" {...args} />
    <SquarePlainButton colorScheme="specialPurple" {...args} />
    <SquarePlainButton colorScheme="transparentDanger" {...args} />
    <SquarePlainButton colorScheme="transparentDefault" {...args} />
    <SquarePlainButton colorScheme="transparentTertiary" {...args} />
    <SquarePlainButton colorScheme="transparentAccent" {...args} />
    <SquarePlainButton colorScheme="transparentPrimary" {...args} />
  </div>
);

const DefaultSquareButton = DefaultTemplate.bind({});
DefaultSquareButton.args = defaultArgs;

const DefaultSquarePlainButton = PlainTemplate.bind({});
DefaultSquarePlainButton.args = defaultArgs;

export { meta as default, DefaultSquareButton, DefaultSquarePlainButton };
