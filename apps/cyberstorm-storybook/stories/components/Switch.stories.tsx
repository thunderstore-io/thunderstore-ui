import { StoryFn, Meta } from "@storybook/react";
import { Switch } from "@thunderstore/cyberstorm";
import React, { CSSProperties, useState } from "react";

export default {
  title: "Cyberstorm/Components/Switch",
  component: Switch,
} as Meta<typeof Switch>;

const backgroundStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--gap--16)",
  backgroundColor: "var(--color-purple--4)",
  padding: "var(--gap--16)",
};

const Template: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);

  return (
    <div style={backgroundStyle}>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
    </div>
  );
};

const SameStateSwitchTemplate: StoryFn<typeof Switch> = () => {
  const [state, setState] = useState(false);

  return (
    <div style={backgroundStyle}>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
    </div>
  );
};

const RegularSwitch = Template.bind({});
const DisabledSwitch = Template.bind({});
DisabledSwitch.args = {
  state: false,
  disabled: true,
};
const SameStateSwitch = SameStateSwitchTemplate.bind({});

export { RegularSwitch, DisabledSwitch, SameStateSwitch };
