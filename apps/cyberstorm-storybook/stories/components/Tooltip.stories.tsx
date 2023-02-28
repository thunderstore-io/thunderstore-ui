import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button, Tooltip } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
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
      <Tooltip {...args}>
        <Button label="Button" />
      </Tooltip>
    </div>
  </div>
);

const DefaultTooltip = Template.bind({});
DefaultTooltip.args = { content: "Tipititappi" };

const LongTip = Template.bind({});
LongTip.args = {
  content:
    "Tiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiipiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiitiiiiiiiiiiiiiiiiiiiiiiiitaaaaaaaaaaaaaaaaaaaaaaaapppppppppppiiiiiiiiiiiiiiiiiiiiiiiiiii",
};

const ShortTip = Template.bind({});
ShortTip.args = {};

export { meta as default, DefaultTooltip, LongTip, ShortTip };
