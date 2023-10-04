import { StoryFn, Meta } from "@storybook/react";
import { Switch } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Switch",
  component: Switch,
} as Meta<typeof Switch>;

const Template: StoryFn<typeof Switch> = (args) => <Switch {...args} />;

const SameStateSwitchTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
    </div>
  );
};
const SameStateSwitchTemplate2: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <label htmlFor="my-switch">My switch</label>
      <div>
        <Switch state={state} onChange={setState} labelId="my-switch" />
      </div>
      <div>
        <Switch state={state} onChange={setState} labelId="my-switch" />
      </div>
    </div>
  );
};
const SameStateSwitchTemplate1: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <label htmlFor="my-switch">
        My itch
        <Switch state={state} onChange={setState} />
      </label>
    </div>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = { state: false, disabled: true };
const SameStateSwitch = SameStateSwitchTemplate.bind({});
const SameStateSwitch1 = SameStateSwitchTemplate1.bind({});
const SameStateSwitch2 = SameStateSwitchTemplate2.bind({});

export {
  meta as default,
  RegularSwitch,
  DisabledSwitch,
  SameStateSwitch,
  SameStateSwitch1,
  SameStateSwitch2,
};
