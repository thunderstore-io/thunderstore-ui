import {
  MultiSelect,
  MultiSelectProps,
  SelectOption,
} from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import React from "react";

const args: MultiSelectProps = {
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  onChange: (opts: SelectOption[] | null) => null,
};

export default { component: MultiSelect } as Meta;

const Template: StoryFn<typeof MultiSelect> = (args) => (
  <MultiSelect {...args} />
);

const NoneSelected = Template.bind({});
NoneSelected.args = args;

/*
const OneSelected = Template.bind({});
OneSelected.args = args;
OneSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText("Search...");
  userEvent.click(input);
  const options = canvas.getAllByRole("option");
  userEvent.click(options[1]);
};

const MultipleSelected = Template.bind({});
MultipleSelected.args = args;
MultipleSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByPlaceholderText("Search...");
  userEvent.click(input);
  const options = canvas.getAllByRole("option");
  userEvent.click(options[1]);
  userEvent.click(input);
  userEvent.click(options[2]);
};*/

export { NoneSelected /* OneSelected, MultipleSelected */ };
