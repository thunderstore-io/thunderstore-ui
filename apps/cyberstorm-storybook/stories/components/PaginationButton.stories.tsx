import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PaginationButton } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/PaginationButton",
  component: PaginationButton,
} as ComponentMeta<typeof PaginationButton>;

const Template: ComponentStory<typeof PaginationButton> = (args) => (
  <PaginationButton {...args} />
);

const DefaultButton = Template.bind({});
DefaultButton.args = {};

export { meta as default, DefaultButton };
