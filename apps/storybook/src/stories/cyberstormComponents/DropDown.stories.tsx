import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  NewButton,
  NewDropDown,
  NewDropDownDivider,
  NewDropDownItem,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import {
  DropDownModifiersList,
  DropDownSizesList,
  DropDownVariantsList,
} from "@thunderstore/cyberstorm-theme";

const meta = {
  title: "Cyberstorm/DropDown",
  component: NewDropDown,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    csVariant: { control: "select", options: DropDownVariantsList },
    csSize: { control: "select", options: DropDownSizesList },
    csModifiers: { control: "multi-select", options: DropDownModifiersList },
  },
  args: {
    csModifiers: [],
    csSize: DropDownSizesList[0],
    csVariant: DropDownVariantsList[0],
    defaultOpen: true,
  },
} satisfies Meta<typeof NewDropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { trigger: <NewButton csVariant="secondary">Open menu</NewButton> },
  render: (args) => (
    <NewDropDown {...args}>
      <NewDropDownItem>
        <span>Item 1</span>
      </NewDropDownItem>
      <NewDropDownItem>
        <span>Item 2</span>
      </NewDropDownItem>
      <NewDropDownDivider />
      <NewDropDownItem>
        <span>Item 3</span>
      </NewDropDownItem>
    </NewDropDown>
  ),
};
