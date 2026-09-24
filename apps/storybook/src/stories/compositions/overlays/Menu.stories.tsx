import { Button } from "@cs/newComponents/Button/Button";
import { Menu } from "@cs/newComponents/Menu/Menu";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OpenPopover, SideBySide, compositionParameters } from "../compare";

/**
 * Open menu. The closed trigger is in Compositions/Chrome.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/Menu",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    chromatic: { ...compositionParameters.chromatic, delay: 300 },
    docs: {
      description: {
        component:
          "Open menu. The closed trigger lives in Compositions/Chrome. Menu uses the Popover API and has no open prop, so this story calls showPopover once on mount. The open panel is pinned to its column so the themed and barebones menus do not stack on the same viewport edge.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenMenu({ scope }: { scope: string }) {
  const popoverId = `${scope}-menu`;
  return (
    <div className="cs-compare__page">
      <Menu popoverId={popoverId} trigger={<Button>Menu</Button>}>
        <div style={{ padding: 16 }}>Package settings</div>
      </Menu>
      <OpenPopover popoverId={popoverId} />
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={(scope) => <OpenMenu scope={scope} />} />,
};
