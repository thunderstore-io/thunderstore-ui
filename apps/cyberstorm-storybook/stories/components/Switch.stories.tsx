import { StoryFn, Meta } from "@storybook/react";
import { Switch } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

export default {
  title: "Cyberstorm/Components/Switch",
  component: Switch,
} as Meta<typeof Switch>;

const defaultArgs = {
  disabled: false,
};

const Template: StoryFn<typeof Switch> = (args) => <Switch {...args} />;

const SameStateSwitchTemplate: StoryFn<typeof Switch> = (args) => {
  const [state, setState] = useState(false);
  return (
    <div>
      <div>
        <Switch {...args} state={state} onChange={setState} />
      </div>
      <div>
        <Switch {...args} state={state} onChange={setState} />
      </div>
    </div>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = {
  ...defaultArgs,
  state: false,
  disabled: true,
};
const SameStateSwitch = SameStateSwitchTemplate.bind({});
SameStateSwitch.args = {
  ...defaultArgs,
};

export { RegularSwitch, DisabledSwitch, SameStateSwitch };
