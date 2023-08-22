import { StoryFn, Meta } from "@storybook/react";
import { IconButton, IconPlainButton } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons";

export default {
  title: "Cyberstorm/Components/IconButton",
  component: IconButton,
} as Meta;

const defaultArgs = {
  tooltipText: "tooltip text",
  icon: <FontAwesomeIcon fixedWidth icon={faXmark} />,
};

const DefaultTemplate: StoryFn<typeof IconButton> = (args) => (
  <div>
    <IconButton colorScheme="danger" {...args} />
    <IconButton colorScheme="default" {...args} />
    <IconButton colorScheme="primary" {...args} />
    <IconButton colorScheme="accent" {...args} />
    <IconButton colorScheme="tertiary" {...args} />
    <IconButton colorScheme="fancyAccent" {...args} />
    <IconButton colorScheme="success" {...args} />
    <IconButton colorScheme="warning" {...args} />
    <IconButton colorScheme="specialGreen" {...args} />
    <IconButton colorScheme="specialPurple" {...args} />
    <IconButton colorScheme="transparentDanger" {...args} />
    <IconButton colorScheme="transparentDefault" {...args} />
    <IconButton colorScheme="transparentTertiary" {...args} />
    <IconButton colorScheme="transparentAccent" {...args} />
    <IconButton colorScheme="transparentPrimary" {...args} />
  </div>
);

const PlainTemplate: StoryFn<typeof IconPlainButton> = (args) => (
  <div>
    <IconPlainButton colorScheme="danger" {...args} />
    <IconPlainButton colorScheme="default" {...args} />
    <IconPlainButton colorScheme="primary" {...args} />
    <IconPlainButton colorScheme="accent" {...args} />
    <IconPlainButton colorScheme="tertiary" {...args} />
    <IconPlainButton colorScheme="fancyAccent" {...args} />
    <IconPlainButton colorScheme="success" {...args} />
    <IconPlainButton colorScheme="warning" {...args} />
    <IconPlainButton colorScheme="specialGreen" {...args} />
    <IconPlainButton colorScheme="specialPurple" {...args} />
    <IconPlainButton colorScheme="transparentDanger" {...args} />
    <IconPlainButton colorScheme="transparentDefault" {...args} />
    <IconPlainButton colorScheme="transparentTertiary" {...args} />
    <IconPlainButton colorScheme="transparentAccent" {...args} />
    <IconPlainButton colorScheme="transparentPrimary" {...args} />
  </div>
);

const DefaultIconButton = DefaultTemplate.bind({});
DefaultIconButton.args = defaultArgs;

const DefaultIconPlainButton = PlainTemplate.bind({});
DefaultIconPlainButton.args = defaultArgs;

export { DefaultIconButton, DefaultIconPlainButton };
