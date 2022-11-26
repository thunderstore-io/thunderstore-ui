import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextInput } from "@thunderstore/cyberstorm";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const defaultArgs = {
  placeholder: "Search...",
};

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

  const onChange = (event) => {
    setSearchValue(event.target.value);
  };

  React.useEffect(() => {
    setSearchValue(searchValue);
  }, [searchValue]);

  const usedArgs = {
    ...args,
    onChange: onChange,
    onLeftIconClick: leftIconHook,
    onRightIconClick: rightIconHook,
    onClear: clearInput,
    value: searchValue,
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
      <div>
        <TextInput {...usedArgs}></TextInput>
      </div>
      <div>
        <TextInput {...usedArgs}></TextInput>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        {searchValue}
        {leftIconTriggered && (
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
            }}
          >
            Left Icon was triggered
          </div>
        )}
        {rightIconTriggered && (
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
            }}
          >
            Right Icon was triggered
          </div>
        )}
      </div>
    </div>
  );
};

const DefaultTextInput = Template.bind({});
DefaultTextInput.args = { ...defaultArgs };

const DisabledTextInput = Template.bind({});
DisabledTextInput.args = { ...defaultArgs, disabled: true };

const SmallTextInput = Template.bind({});
SmallTextInput.args = {
  ...defaultArgs,
  textInputStyle: "root__small",
};

const CustomIconsTextInput = Template.bind({});
CustomIconsTextInput.args = {
  ...defaultArgs,
  leftIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
  rightIcon: <FontAwesomeIcon fixedWidth={true} icon={faSkull} />,
};

export {
  meta as default,
  DefaultTextInput,
  DisabledTextInput,
  SmallTextInput,
  CustomIconsTextInput,
};
