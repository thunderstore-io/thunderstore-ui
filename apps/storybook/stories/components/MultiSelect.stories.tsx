import { MultiSelect } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import React from "react";

import * as SelectStories from "./Select.stories";

const meta = { component: MultiSelect } as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = (args) => (
  <MultiSelect {...args} />
);

const NoneSelected = Template.bind({});
NoneSelected.args = { ...SelectStories.Select.args };

const OneSelected = Template.bind({});
OneSelected.args = { ...SelectStories.Select.args };
OneSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText("Search...");
  userEvent.click(input);
  const options = canvas.getAllByRole("option");
  userEvent.click(options[1]);
};

const MultipleSelected = Template.bind({});
MultipleSelected.args = { ...SelectStories.Select.args };
MultipleSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText("Search...");
  userEvent.click(input);
  const options = canvas.getAllByRole("option");
  userEvent.click(options[1]);
  userEvent.click(input);
  userEvent.click(options[2]);
};

export { meta as default, NoneSelected, OneSelected, MultipleSelected };
