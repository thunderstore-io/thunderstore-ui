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
const SwitchLabelIdTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <label htmlFor="my-switch">My switch</label>
      <div>
        <Switch state={state} onChange={setState} labelId="my-switch" />
      </div>
    </div>
  );
};
const SwitchLabelWithoutNestingTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <label htmlFor="my-switch">
        My switch
        <Switch state={state} onChange={setState} />
      </label>
    </div>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = { state: false, disabled: true };
const SameStateSwitch = SameStateSwitchTemplate.bind({});
const SwitchLabelWithoutNesting = SwitchLabelWithoutNestingTemplate.bind({});
const SwitchLabelId = SwitchLabelIdTemplate.bind({});

export {
  meta as default,
  RegularSwitch,
  DisabledSwitch,
  SameStateSwitch,
  SwitchLabelId,
  SwitchLabelWithoutNesting,
};
