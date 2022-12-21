import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Switch } from "@thunderstore/cyberstorm";
import React, { CSSProperties, useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const backgroundStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--gap-m)",
  backgroundColor: "var(--color-purple--40)",
  padding: "var(--padding-m)",
};

const Template: ComponentStory<typeof Switch> = () => {
  const [state, setState] = useState(false);

  return (
    <div style={backgroundStyle}>
      <div>
        <Switch state={state} onChange={setState} />
      </div>
    </div>
  );
};

const SameStateSwitchTemplate: ComponentStory<typeof Switch> = () => {
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

export { meta as default, RegularSwitch, DisabledSwitch, SameStateSwitch };
