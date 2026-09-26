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
          "Open menu. The closed trigger lives in Compositions/Chrome. Menu uses the Popover API and has no open prop, so this story calls showPopover once on mount. It is separate because an open menu is a browser top-layer popover and cannot sit in a shared page canvas without covering the other components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenMenu({ scope }: { scope: string }) {
  const popoverId = `${scope}-menu`;
  return (
    <>
      <Menu popoverId={popoverId} trigger={<Button>Menu</Button>}>
        <div style={{ padding: 16 }}>Package settings</div>
      </Menu>
      <OpenPopover popoverId={popoverId} />
    </>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={(scope) => <OpenMenu scope={scope} />} />,
};
