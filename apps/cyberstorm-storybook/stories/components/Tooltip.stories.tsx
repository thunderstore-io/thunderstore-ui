import { StoryFn, Meta } from "@storybook/react";
import { Button, Tooltip } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Tooltip",
  component: Tooltip,
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = (args) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap--4)",
      backgroundColor: "var(--color-cyber-green--40)",
      padding: "var(--space--16)",
    }}
  >
    <div>
      <Tooltip {...args}>
        <Button.Root>
          <Button.ButtonLabel>Button</Button.ButtonLabel>
        </Button.Root>
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
