import { Button } from "@cs/newComponents/Button/Button";
import {
  DropDown,
  DropDownDivider,
  DropDownItem,
  DropDownSub,
  DropDownSubContent,
  DropDownSubTrigger,
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
    chromatic: { ...compositionParameters.chromatic, delay: 300 },
    docs: {
      description: {
        component:
          "Open dropdown, portaled into this column, with the Teams submenu open beside it. The closed trigger lives in Compositions/Chrome. This story is separate because the open menu would cover the rest of a shared page canvas. Item, divider, modifier, and submenu states are inside this one open menu. DropDownItem renders its child with asChild, so each label is an element; a text node would not mount.",
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
        <DropDownItem>
          <span>Settings</span>
        </DropDownItem>
        <DropDownSub defaultOpen>
          <DropDownSubTrigger>Teams</DropDownSubTrigger>
          <DropDownSubContent>
            <DropDownItem>
              <span>Northstar</span>
            </DropDownItem>
            <DropDownItem>
              <span>Vanilla</span>
            </DropDownItem>
          </DropDownSubContent>
        </DropDownSub>
        <DropDownItem csModifiers={["ghost"]}>
          <span>Ghost</span>
        </DropDownItem>
        <DropDownDivider />
        <DropDownItem csModifiers={["disabled"]}>
          <span>Disabled</span>
        </DropDownItem>
      </DropDown>
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenDropDown />} />,
};
