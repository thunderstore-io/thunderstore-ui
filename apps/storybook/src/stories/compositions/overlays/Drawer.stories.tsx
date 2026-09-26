import { Button } from "@cs/newComponents/Button/Button";
import { Drawer, DrawerDivider } from "@cs/newComponents/Drawer/Drawer";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OpenPopover, SideBySide, compositionParameters } from "../compare";

/**
 * Open drawer. The closed trigger is in Compositions/Listings.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/Drawer",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    chromatic: { ...compositionParameters.chromatic, delay: 300 },
    docs: {
      description: {
        component:
          "Open drawer, including DrawerDivider between two filter groups. The closed trigger lives in Compositions/Listings. Drawer uses the Popover API and has no open prop, so this story calls showPopover once on mount. It is separate because an open drawer is a browser top-layer popover and cannot sit in a shared page canvas without covering the other components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDrawer({ scope }: { scope: string }) {
  const popoverId = `${scope}-drawer`;
  return (
    <>
      <Drawer
        popoverId={popoverId}
        trigger={<Button>Filters</Button>}
        headerContent="Filters"
      >
        <div style={{ padding: 16 }}>Filter by tag</div>
        <DrawerDivider />
        <div style={{ padding: 16 }}>Filter by author</div>
      </Drawer>
      <OpenPopover popoverId={popoverId} />
    </>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={(scope) => <OpenDrawer scope={scope} />} />,
};
