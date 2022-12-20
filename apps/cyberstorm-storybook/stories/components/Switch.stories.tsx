import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Switch } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const defaultArgs = {
  state: false,
};

const Template: ComponentStory<typeof Switch> = (args) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25em",
        backgroundColor: "#7e26b6",
        padding: "1rem",
      }}
    >
      <div>
        <Switch {...args} />
      </div>
    </div>
  );
};

const SameStateSwitchTemplate: ComponentStory<typeof Switch> = () => {
  const [state, setState] = useState(false);
  const switchCallback = (x: boolean) => {
    setState(x);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25em",
        backgroundColor: "#7e26b6",
        padding: "1rem",
      }}
    >
      <div>
        <Switch state={state} switchCallback={switchCallback} />
      </div>
      <div>
        <Switch state={state} switchCallback={switchCallback} />
      </div>
    </div>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = {
  ...defaultArgs,
  disabled: true,
};
const SameStateSwitch = SameStateSwitchTemplate.bind({});

export { meta as default, RegularSwitch, DisabledSwitch, SameStateSwitch };
