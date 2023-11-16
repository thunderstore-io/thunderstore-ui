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
        <Switch checked={state} onCheckedChange={setState} />
      </div>
      <div>
        <Switch checked={state} onCheckedChange={setState} />
      </div>
    </div>
  );
};
const SwitchLabelIdTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <>
      <label htmlFor="my-switch">My switch</label>
      <Switch checked={state} onCheckedChange={setState} id="my-switch" />
    </>
  );
};
const SwitchNestedLabelTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);
  return (
    <label>
      My switch
      <Switch checked={state} onCheckedChange={setState} />
    </label>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = { checked: false, disabled: true };
const SameStateSwitch = SameStateSwitchTemplate.bind({});
const SwitchNestedLabel = SwitchNestedLabelTemplate.bind({});
const SwitchLabelId = SwitchLabelIdTemplate.bind({});

export {
  meta as default,
  RegularSwitch,
  DisabledSwitch,
  SameStateSwitch,
  SwitchLabelId,
  SwitchNestedLabel,
};
