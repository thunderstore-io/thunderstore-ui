import { StoryFn, Meta } from "@storybook/react";
import { ToggleSwitch } from "@thunderstore/components";
import React, { useState } from "react";

export default { component: ToggleSwitch } as Meta;

const Template: StoryFn<typeof ToggleSwitch> = () => {
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);
  const [full, setFull] = useState(false);

  return (
    <div>
      <ToggleSwitch value={sm} setValue={setSm} />
      <ToggleSwitch
        size="md"
        value={md}
        setValue={setMd}
        offLabel="off"
        onLabel="on"
      />
      <ToggleSwitch
        size="lg"
        value={lg}
        setValue={setLg}
        offLabel="INITIAL VALUE"
        onLabel="ALTERNATIVE VALUE"
      />
      <ToggleSwitch
        size="full"
        value={full}
        setValue={setFull}
        offLabel="They don't think it be like it is..."
        onLabel="...but it do"
      />
    </div>
  );
};

const Toggles = Template.bind({});

export { Toggles as ToggleSwitch };
