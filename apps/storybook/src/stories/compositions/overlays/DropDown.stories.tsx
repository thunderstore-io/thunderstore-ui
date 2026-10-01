import { Button } from "@cs/newComponents/Button/Button";
import {
  DropDown,
  DropDownDivider,
  DropDownItem,
  DropDownSub,
  DropDownSubContent,
  DropDownSubTrigger,
} from "@cs/newComponents/DropDown/DropDown";
import { Icon } from "@cs/newComponents/Icon/Icon";
import { Link } from "@cs/newComponents/Link/Link";
import { faHelicopter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          "Open dropdown, portaled into this column, with the Teams submenu open beside it. The closed trigger lives in Compositions/Chrome. This story is separate because the open menu would cover the rest of a shared page canvas. Item, divider, danger, disabled, and submenu states are inside this one open menu. DropDownItem renders its child with asChild, so each label is an element; a text node would not mount.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenDropDown() {
  return (
    <div className="cs-compare__menu-space">
      <DropDown open trigger={<Button csVariant="secondary">More</Button>}>
        <DropDownItem>
          <span>Default</span>
        </DropDownItem>

        <DropDownItem>
          <Link primitiveType="cyberstormLink" linkId="Index">
            <Icon csMode="inline" noWrapper csVariant="tertiary">
              <FontAwesomeIcon icon={faHelicopter} />
            </Icon>
            Link
          </Link>
        </DropDownItem>

        <DropDownItem rootClasses="navigation-header--focus">
          <Link
            primitiveType="link"
            rootClasses="dropdown__item"
            href="https://thunderstore.io/"
          >
            Right Icon
            <Icon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faHelicopter} />
            </Icon>
          </Link>
        </DropDownItem>

        <DropDownSub open>
          <DropDownSubTrigger>Open Submenu</DropDownSubTrigger>
          <DropDownSubContent>
            <DropDownItem>
              <span>Submenu Default</span>
            </DropDownItem>
            <DropDownItem disabled>
              <span>Submenu Disabled</span>
            </DropDownItem>
            <DropDownItem csVariant="danger">
              <span>Submenu Danger</span>
            </DropDownItem>
          </DropDownSubContent>
        </DropDownSub>

        <DropDownItem csVariant="danger">
          <span>Danger</span>
        </DropDownItem>

        <DropDownDivider />

        <DropDownItem disabled>
          <span>Disabled</span>
        </DropDownItem>
      </DropDown>
    </div>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenDropDown />} />,
};
