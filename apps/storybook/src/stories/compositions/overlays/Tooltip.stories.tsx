import { Button } from "@cs/newComponents/Button/Button";
import { Tooltip } from "@cs/newComponents/Tooltip/Tooltip";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, compositionParameters } from "../compare";

/**
 * Open tooltip. The closed trigger is in Compositions/Chrome.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/Tooltip",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Open tooltip, portaled into this column. The closed trigger lives in Compositions/Chrome. This story is separate because the open tooltip would cover neighbouring controls on a shared page canvas.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenTooltip() {
  return (
    <div className="cs-page__row" style={{ paddingTop: 48 }}>
      <Tooltip content="Above the button" side="top" open>
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Below the button" side="bottom" open>
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="To the left" side="left" open>
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="To the right" side="right" open>
        <Button>Right</Button>
      </Tooltip>
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenTooltip />} />,
};
