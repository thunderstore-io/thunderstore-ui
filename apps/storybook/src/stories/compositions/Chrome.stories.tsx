import { Avatar } from "@cs/newComponents/Avatar/Avatar";
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
import { Heading } from "@cs/newComponents/Heading/Heading";
import {
  HeadingSizesList,
  HeadingVariantsList,
} from "@cs/newComponents/Heading/Heading.types";
import { Icon } from "@cs/newComponents/Icon/Icon";
import { IconVariantsList } from "@cs/newComponents/Icon/Icon.types";
import { Image } from "@cs/newComponents/Image/Image";
import { Link } from "@cs/newComponents/Link/Link";
import { LinkVariantsList } from "@cs/newComponents/Link/Link.types";
import {
  OverwolfLogo,
  ThunderstoreLogo,
  ThunderstoreLogoHorizontal,
} from "@cs/svg/svg";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, States, compositionParameters } from "./compare";
import { communityImage } from "./fixtures";

/**
 * Featuring: Heading, BreadCrumbs, Avatar, Image, Link, Button, Icon,
 * ThunderstoreLogo, ThunderstoreLogoHorizontal, OverwolfLogo, DropDown.
 * The open dropdown panel is a separate overlay story. See the featuring rule
 * in compare.tsx.
 */
const meta = {
  title: "Compositions/Chrome",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Page chrome grouped by component: heading, breadcrumbs, avatar, image, link, button, icon, and the Thunderstore and Overwolf marks, plus a closed dropdown. The open dropdown panel is Compositions/Overlays/DropDown.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Chrome() {
  return (
    <div className="cs-page">
      <States title="Breadcrumbs">
        <div style={{ width: 300 }}>
          <BreadCrumbs>
            <BreadCrumbsItem>Just Text</BreadCrumbsItem>
            <BreadCrumbsLink primitiveType="link" href="#category">
              Category
            </BreadCrumbsLink>
          </BreadCrumbs>
        </div>
      </States>
      <div className="cs-page__row">
        <States title="Avatar sizes">
          <Avatar username="Username" src={communityImage} csSize="verySmoll" />
          <Avatar username="Username" src={communityImage} csSize="small" />
          <Avatar username="Username" src={communityImage} csSize="medium" />
          <Avatar username="Username" src={communityImage} csSize="large" />
        </States>
      </div>
      <div className="cs-page__row">
        <States title="Image">
          <div style={{ width: 96, height: 96 }}>
            <Image
              src={communityImage}
              alt="Community"
              loading="eager"
              intrinsicWidth={96}
              intrinsicHeight={96}
            />
          </div>
        </States>
      </div>
      <div className="cs-page__row">
        <States title="Logos">
          <ThunderstoreLogo width={28} height={28} aria-label="Thunderstore" />
          <ThunderstoreLogoHorizontal
            width={168}
            height={26}
            aria-label="Thunderstore"
          />
          <OverwolfLogo width={28} height={28} aria-label="Overwolf" />
        </States>
      </div>
      <div className="cs-page__row">
        <States title="Heading sizes">
          {HeadingSizesList.map((size) => (
            <Heading key={size} csLevel="2" csSize={size}>
              Heading {size}
            </Heading>
          ))}
        </States>
      </div>
      <div className="cs-page__row">
        <States title="Heading variants">
          {HeadingVariantsList.map((variant) => (
            <Heading key={variant} csLevel="3" csVariant={variant}>
              {variant}
            </Heading>
          ))}
        </States>
      </div>
      <div className="cs-page__row">
        <States title="Button variants">
          {ButtonVariantsList.map((variant) => (
            <Button key={variant} csVariant={variant}>
              {variant}
            </Button>
          ))}
        </States>
      </div>
      <div className="cs-page__row">
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
      </div>
      <div className="cs-page__row">
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
      </div>
      <div className="cs-page__row">
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
      </div>
      <div className="cs-page__row">
        <States title="Dropdowns">
          <DropDown trigger={<Button csVariant="secondary">More</Button>}>
            <DropDownItem>
              <span>Item</span>
            </DropDownItem>
            <DropDownDivider />
            <DropDownItem csVariant="danger">
              <span>Danger</span>
            </DropDownItem>
            <DropDownItem disabled>
              <span>Disabled</span>
            </DropDownItem>
          </DropDown>
          <DropDown disabled trigger={<Button>Disabled</Button>}>
            <DropDownItem>
              <span>Disabled item, shouldn&apos;t be seen</span>
            </DropDownItem>
          </DropDown>
        </States>
      </div>
    </div>
  );
}

export const Page: Story = {
  render: () => <SideBySide render={() => <Chrome />} />,
};
