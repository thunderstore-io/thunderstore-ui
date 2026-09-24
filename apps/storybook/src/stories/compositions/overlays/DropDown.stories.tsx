import { Button } from "@cs/newComponents/Button/Button";
import {
  DropDown,
  DropDownDivider,
  DropDownItem,
} from "@cs/newComponents/DropDown/DropDown";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, compositionParameters } from "../compare";

/**
 * Open dropdown. The closed trigger is in Compositions/Chrome.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/DropDown",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Open dropdown, portaled into this column. The closed trigger lives in Compositions/Chrome. This story is separate because the open menu would cover the rest of a shared page canvas. Item, divider, and modifier states are inside this one open menu.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDropDown() {
  return (
    <div className="cs-compare__menu-space">
      <DropDown
        defaultOpen
        trigger={<Button csVariant="secondary">More</Button>}
      >
        <DropDownItem>Settings</DropDownItem>
        <DropDownItem csModifiers={["ghost"]}>Ghost</DropDownItem>
        <DropDownDivider />
        <DropDownItem csModifiers={["disabled"]}>Disabled</DropDownItem>
      </DropDown>
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenDropDown />} />,
};
