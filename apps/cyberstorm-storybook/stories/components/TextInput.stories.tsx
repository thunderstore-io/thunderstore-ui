import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextInput } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [leftIconTriggered, setleftIconTriggered] = React.useState(false);
  const [rightIconTriggered, setrightIconTriggered] = React.useState(false);

  const leftIconHook = () => {
    setleftIconTriggered(true);
  };

  const rightIconHook = () => {
    setrightIconTriggered(true);
  };

  const clearInput = () => {
    setSearchValue("");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const usedArgs = {
    ...args,
    onChange: onChange,
    onLeftIconClick: leftIconHook,
    onRightIconClick: rightIconHook,
    onClear: clearInput,
    value: searchValue,
  };

  const iconWrapperDivStyle = {
    backgroundColor: "white",
    padding: "1rem",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <TextInput {...usedArgs}></TextInput>
      <TextInput {...usedArgs}></TextInput>
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        {searchValue}
        {leftIconTriggered && (
          <div style={{ iconWrapperDivStyle }}>Left Icon was triggered</div>
        )}
        {rightIconTriggered && (
          <div style={{ iconWrapperDivStyle }}>Right Icon was triggered</div>
        )}
      </div>
    </div>
  );
};

const defaultArgs = {
  placeholder: "Search...",
};

const DefaultTextInput = Template.bind({});
DefaultTextInput.args = { ...defaultArgs };

const DisabledTextInput = Template.bind({});
DisabledTextInput.args = { ...defaultArgs, disabled: true };

const SmallTextInput = Template.bind({});
SmallTextInput.args = {
  ...defaultArgs,
  size: "small",
};

const CustomIconsTextInput = Template.bind({});
CustomIconsTextInput.args = {
  ...defaultArgs,
  leftIcon: <FontAwesomeIcon fixedWidth icon={faMagnifyingGlass} />,
  rightIcon: <FontAwesomeIcon fixedWidth icon={faSkull} />,
};

export {
  meta as default,
  DefaultTextInput,
  DisabledTextInput,
  SmallTextInput,
  CustomIconsTextInput,
};
