import { StoryFn, Meta } from "@storybook/react";
import { NewTextInput } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "TextInput",
  component: NewTextInput,
} as Meta<typeof NewTextInput>;

const defaultArgs = {
  csColor: "cyber-green",
};

const Template: StoryFn<typeof NewTextInput> = (args) => (
  <NewTextInput {...args} />
);

const ReferenceTextInput = Template.bind({});
ReferenceTextInput.args = {};

const IconTextInput = Template.bind({});
IconTextInput.args = {
  leftIcon: <FontAwesomeIcon icon={faSearch} />,
};

const PlaceholderTextInput = Template.bind({});
PlaceholderTextInput.args = {
  placeholder: "Placeholder text",
};

const ValueTextInput = Template.bind({});
ValueTextInput.args = {
  ...defaultArgs,
  value: "Text value",
};

const ValueTextWithClearInput = Template.bind({});
ValueTextWithClearInput.args = {
  value: "Text value",
  clearValue: () => {
    return;
  },
};

const PlaceholderClearValueLeftIcon = Template.bind({});
PlaceholderClearValueLeftIcon.args = {
  placeholder: "Placeholder text",
  clearValue: () => {
    return;
  },
  leftIcon: <FontAwesomeIcon icon={faSearch} />,
};

export {
  meta as default,
  ReferenceTextInput,
  IconTextInput,
  PlaceholderTextInput,
  ValueTextInput,
  ValueTextWithClearInput,
  PlaceholderClearValueLeftIcon,
};
