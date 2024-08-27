import { StoryFn, Meta } from "@storybook/react";
import { TextInput } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/TextInput",
  component: TextInput,
} as Meta<typeof TextInput>;

const defaultArgs = {};

const Template: StoryFn<typeof TextInput> = (args) => <TextInput {...args} />;

const ReferenceTextInput = Template.bind({});
ReferenceTextInput.args = defaultArgs;

const IconTextInput = Template.bind({});
IconTextInput.args = {
  ...defaultArgs,
  leftIcon: <FontAwesomeIcon icon={faSearch} />,
};

const PlaceholderTextInput = Template.bind({});
PlaceholderTextInput.args = {
  ...defaultArgs,
  placeholder: "Placeholder text",
};

const ValueTextInput = Template.bind({});
ValueTextInput.args = {
  ...defaultArgs,
  value: "Text value",
};

const ValueTextWithClearInput = Template.bind({});
ValueTextWithClearInput.args = {
  ...defaultArgs,
  value: "Text value",
  clearValue: () => {
    return;
  },
};

export {
  meta as default,
  ReferenceTextInput,
  IconTextInput,
  PlaceholderTextInput,
  ValueTextInput,
  ValueTextWithClearInput,
};
