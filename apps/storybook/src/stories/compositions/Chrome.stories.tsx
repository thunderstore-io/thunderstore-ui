import { Avatar } from "@cs/newComponents/Avatar/Avatar";
import { AvatarSizesList } from "@cs/newComponents/Avatar/Avatar.types";
import {
  BreadCrumbs,
  BreadCrumbsItem,
  BreadCrumbsLink,
} from "@cs/newComponents/BreadCrumbs/BreadCrumbs";
import { Button } from "@cs/newComponents/Button/Button";
import {
  ButtonModifiersList,
  ButtonSizesList,
  ButtonVariantsList,
} from "@cs/newComponents/Button/Button.types";
import {
  DropDown,
  DropDownDivider,
  DropDownItem,
} from "@cs/newComponents/DropDown/DropDown";
import { DropDownItemModifiersList } from "@cs/newComponents/DropDown/DropDown.types";
import { Heading } from "@cs/newComponents/Heading/Heading";
import {
  HeadingModifiersList,
  HeadingSizesList,
  HeadingVariantsList,
} from "@cs/newComponents/Heading/Heading.types";
import { Icon } from "@cs/newComponents/Icon/Icon";
import { IconVariantsList } from "@cs/newComponents/Icon/Icon.types";
import { Image } from "@cs/newComponents/Image/Image";
import { Link } from "@cs/newComponents/Link/Link";
import { LinkVariantsList } from "@cs/newComponents/Link/Link.types";
import { Menu } from "@cs/newComponents/Menu/Menu";
import { Tooltip } from "@cs/newComponents/Tooltip/Tooltip";
import { faGamepad, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, States, compositionParameters } from "./compare";
import { communityImage } from "./fixtures";

/**
 * Featuring: Heading, BreadCrumbs, Avatar, Image, Link, Button, Icon.
 * DropDown, Menu, and Tooltip are mounted closed here; their open panels are
 * separate overlay stories. See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Chrome",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Page chrome: heading, breadcrumbs, avatar, image, link, button, and icon, plus the closed dropdown, menu, and tooltip. DropDown, Menu, and Tooltip stay closed here so an open panel does not cover the page. Their open panels are Compositions/Overlays/DropDown, Menu, and Tooltip. The rows under the layout are the variant, size, and modifier states from the component stories.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Chrome({ scope }: { scope: string }) {
  return (
    <div className="cs-page">
      <BreadCrumbs>
        <BreadCrumbsLink primitiveType="link" href="#communities">
          Communities
        </BreadCrumbsLink>
        <BreadCrumbsLink primitiveType="link" href="#valheim">
          <Image
            src={communityImage}
            fallbackIcon={faGamepad}
            square
            alt=""
            rootClasses="breadcrumbs__community-icon"
          />
          Valheim
        </BreadCrumbsLink>
        <BreadCrumbsItem>Northstar</BreadCrumbsItem>
      </BreadCrumbs>
      <div className="cs-page__row">
        <Avatar username="Northstar" src={communityImage} csSize="large" />
        <div>
          <Heading csLevel="1">Northstar</Heading>
          <Link primitiveType="link" href="#packages">
            View packages
          </Link>
        </div>
        <div style={{ width: 96, height: 96 }}>
          <Image
            src={communityImage}
            alt="Community"
            loading="eager"
            intrinsicWidth={96}
            intrinsicHeight={96}
          />
        </div>
      </div>
      <div className="cs-page__row">
        <Button>Subscribe</Button>
        <Button csVariant="secondary" primitiveType="link" href="#share">
          Share
        </Button>
        <Icon csMode="inline" csVariant="accent">
          <FontAwesomeIcon icon={faStar} />
        </Icon>
        <DropDown trigger={<Button csVariant="secondary">More</Button>}>
          <DropDownItem>
            <span>Settings</span>
          </DropDownItem>
          <DropDownDivider />
          <DropDownItem>
            <span>Report</span>
          </DropDownItem>
        </DropDown>
        <Menu
          popoverId={`${scope}-chrome-menu`}
          trigger={<Button csVariant="secondary">Menu</Button>}
        >
          <div style={{ padding: 8 }}>Menu content</div>
        </Menu>
        <Tooltip content="Account settings">
          <Button csVariant="secondary">Account</Button>
        </Tooltip>
      </div>

      <States title="Heading sizes">
        {HeadingSizesList.map((size) => (
          <Heading key={size} csLevel="2" csSize={size}>
            Heading {size}
          </Heading>
        ))}
      </States>
      <States title="Heading variants">
        {HeadingVariantsList.map((variant) => (
          <Heading key={variant} csLevel="3" csVariant={variant}>
            {variant}
          </Heading>
        ))}
        {HeadingModifiersList.map((modifier) => (
          <Heading key={modifier} csLevel="3" csModifiers={[modifier]}>
            {modifier}
          </Heading>
        ))}
      </States>
      <States title="Button variants">
        {ButtonVariantsList.map((variant) => (
          <Button key={variant} csVariant={variant}>
            {variant}
          </Button>
        ))}
      </States>
      <States title="Button sizes and modifiers">
        {ButtonSizesList.map((size) => (
          <Button key={size} csSize={size}>
            {size}
          </Button>
        ))}
        {ButtonModifiersList.map((modifier) => (
          <Button key={modifier} csModifiers={[modifier]}>
            {modifier === "only-icon" ? (
              <Icon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faStar} />
              </Icon>
            ) : (
              modifier
            )}
          </Button>
        ))}
        <Button primitiveType="cyberstormLink" linkId="Communities">
          Communities
        </Button>
      </States>
      <States title="Icon variants">
        {IconVariantsList.map((variant) => (
          <Icon key={variant} csMode="inline" csVariant={variant}>
            <FontAwesomeIcon icon={faStar} />
          </Icon>
        ))}
        <Icon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faStar} />
        </Icon>
      </States>
      <States title="Link">
        {LinkVariantsList.map((variant) => (
          <Link
            key={variant}
            primitiveType="link"
            href="#link"
            csVariant={variant}
          >
            {variant}
          </Link>
        ))}
        <Link primitiveType="link" href="#disabled" disabled>
          Disabled
        </Link>
      </States>
      <States title="Avatar sizes">
        {AvatarSizesList.map((size) => (
          <Avatar key={size} username="Northstar" csSize={size} />
        ))}
        <Avatar username="Northstar" src={null} />
      </States>
      <States title="Image">
        <div style={{ width: 96, height: 96 }}>
          <Image src={null} fallbackIcon={faGamepad} alt="Community" square />
        </div>
        <div style={{ width: 96, height: 96 }}>
          <Image src={null} fallbackIcon={faStar} alt="Package" />
        </div>
      </States>
      <States title="Breadcrumbs">
        <div style={{ width: 120 }}>
          <BreadCrumbs>
            <BreadCrumbsItem>Just Text</BreadCrumbsItem>
            <BreadCrumbsLink primitiveType="link" href="#category">
              Category
            </BreadCrumbsLink>
          </BreadCrumbs>
        </div>
      </States>
      <States title="Closed dropdown item modifiers">
        {DropDownItemModifiersList.map((modifier) => (
          <DropDown
            key={modifier}
            csModifiers={modifier === "ghost" ? ["ghost"] : undefined}
            trigger={<Button csVariant="secondary">{modifier}</Button>}
          >
            <DropDownItem csModifiers={[modifier]}>
              <span>{modifier}</span>
            </DropDownItem>
          </DropDown>
        ))}
      </States>
    </div>
  );
}

export const Page: Story = {
  render: () => <SideBySide render={(scope) => <Chrome scope={scope} />} />,
};
