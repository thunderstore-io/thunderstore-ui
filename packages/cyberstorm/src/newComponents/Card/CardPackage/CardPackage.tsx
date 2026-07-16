import {
  faBan,
  faClockRotateLeft,
  faCodeBranch,
  faDownload,
  faThumbTack,
  faThumbsUp,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { faLips } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import {
  type CardPackageModifiers,
  type CardPackageSizes,
} from "@thunderstore/cyberstorm-theme";
import { type PackageListing } from "@thunderstore/dapper/types";

import { RelativeTime } from "../../../components/RelativeTime/RelativeTime";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";
import { ThunderstoreLogo } from "../../../svg/svg";
import {
  classnames,
  componentClasses,
  formatInteger,
  formatToDisplayName,
} from "../../../utils/utils";
import { Button as NewButton } from "../../Button/Button";
import { Icon as NewIcon } from "../../Icon/Icon";
import { Image } from "../../Image/Image";
import { Link as NewLink } from "../../Link/Link";
import { MetaItem as NewMetaItem } from "../../MetaItem/MetaItem";
import { Tag as NewTag } from "../../Tag/Tag";
import "./CardPackage.css";

interface Props {
  packageData: PackageListing;
  isLiked: boolean;
  packageLikeAction?: () => void;
  csSize?: CardPackageSizes;
  csModifiers?: CardPackageModifiers;
  rootClasses?: string;
}

export function CardPackage(props: Props) {
  const {
    packageData,
    isLiked,
    packageLikeAction,
    csSize = "medium",
    csModifiers,
    rootClasses,
  } = props;

  const [tooltipText, setTooltipText] = useState(
    new Date(packageData.last_updated).toLocaleString("en-US")
  );

  useEffect(() => {
    setTooltipText(
      new Date(packageData.last_updated).toLocaleString(navigator.languages)
    );
  }, [packageData.last_updated]);

  const hasDescription = packageData.description.trim().length > 0;
  const hasCategories = packageData.categories.length > 0;
  const hasImageTags =
    packageData.is_pinned || packageData.is_nsfw || packageData.is_deprecated;

  // Pinned / NSFW / Deprecated badges. Grid mode overlays them on the image;
  // list mode shows them inline next to the title (see CardPackage.css). The
  // layout is chosen purely by CSS from html[data-card-layout], so both
  // placements sit in the DOM and one is hidden.
  const renderBadges = () => (
    <>
      {packageData.is_pinned ? (
        <NewTag csSize="small" csModifiers={["dark"]} csVariant="blue">
          <NewIcon noWrapper csMode="inline">
            <FontAwesomeIcon icon={faThumbTack} />
          </NewIcon>
          Pinned
        </NewTag>
      ) : null}
      {packageData.is_nsfw ? (
        <NewTag csSize="small" csModifiers={["dark"]} csVariant="pink">
          <NewIcon noWrapper csMode="inline">
            <FontAwesomeIcon icon={faLips} />
          </NewIcon>
          NSFW
        </NewTag>
      ) : null}
      {packageData.is_deprecated ? (
        <NewTag csSize="small" csModifiers={["dark"]} csVariant="yellow">
          <NewIcon noWrapper csMode="inline">
            <FontAwesomeIcon icon={faWarning} />
          </NewIcon>
          Deprecated
        </NewTag>
      ) : null}
    </>
  );

  return (
    <div
      className={classnames(
        "card-package",
        ...componentClasses("card-package", "card", csSize, csModifiers),
        rootClasses
      )}
    >
      <NewLink
        tabIndex={-1}
        primitiveType="cyberstormLink"
        linkId="Package"
        community={packageData.community_identifier}
        namespace={packageData.namespace}
        package={packageData.name}
        title={`${formatToDisplayName(packageData.name)} by ${
          packageData.namespace
        }`}
        rootClasses="card-package__media"
      >
        {hasImageTags ? (
          <div className="card-package__image-tags">{renderBadges()}</div>
        ) : null}
        <Image
          src={packageData.icon_url}
          fallbackIcon={faBan}
          rootClasses="card-package__image-wrapper"
          square
          intrinsicWidth={256}
          intrinsicHeight={256}
        />
      </NewLink>

      <div className="card-package__content">
        <div className="card-package__info">
          <div className="card-package__heading">
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Package"
              community={packageData.community_identifier}
              namespace={packageData.namespace}
              package={packageData.name}
              rootClasses="card-package__title"
              title={formatToDisplayName(packageData.name)}
            >
              {formatToDisplayName(packageData.name)}
            </NewLink>
            {hasImageTags ? (
              <div className="card-package__badges">{renderBadges()}</div>
            ) : null}
          </div>

          <div className="card-package__author">
            <span className="card-package__prefix">by</span>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Team"
              community={packageData.community_identifier}
              team={packageData.namespace}
              title={packageData.namespace}
              rootClasses="card-package__link"
              csVariant="cyber"
            >
              {packageData.namespace}
            </NewLink>
          </div>
        </div>

        {hasDescription ? (
          <p className="card-package__description">{packageData.description}</p>
        ) : null}

        {hasCategories ? (
          <div className="card-package__tags">
            {packageData.categories.map((c) => (
              <NewTag
                csMode="link"
                href={`/c/${packageData.community_identifier}/?includedCategories=${c.id}`}
                key={`category_${c.id}`}
                csVariant="primary"
                csSize="xsmall"
                csModifiers={["dark", "hoverable"]}
              >
                <span>{c.name}</span>
              </NewTag>
            ))}
          </div>
        ) : null}

        <div className="card-package__footer">
          <div className="card-package__meta">
            <TooltipWrapper
              tooltipText={`${formatInteger(
                packageData.download_count,
                "standard"
              )} Downloads`}
            >
              <NewMetaItem csSize="12">
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faDownload} />
                </NewIcon>
                {formatInteger(packageData.download_count)}
              </NewMetaItem>
            </TooltipWrapper>
            <TooltipWrapper
              tooltipText={`${formatInteger(
                packageData.rating_count,
                "standard"
              )} Likes`}
            >
              <NewMetaItem
                csSize="12"
                primitiveType="metaItemActionable"
                onClick={packageLikeAction}
              >
                <NewIcon
                  csMode="inline"
                  noWrapper
                  rootClasses={isLiked ? "card-package--is-liked" : undefined}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </NewIcon>
                {formatInteger(packageData.rating_count)}
              </NewMetaItem>
            </TooltipWrapper>
            {/* Latest version — list variant only (hidden in grid via CSS), and
                only when the backend supplies it (see PackageListing). */}
            {packageData.latest_version_number ? (
              <NewMetaItem csSize="12" rootClasses="card-package__version">
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faCodeBranch} />
                </NewIcon>
                {packageData.latest_version_number}
              </NewMetaItem>
            ) : null}
          </div>
          <TooltipWrapper tooltipText={tooltipText}>
            <span className="card-package__updated" aria-label="Last Updated">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </NewIcon>
              <RelativeTime
                time={packageData.last_updated}
                suppressHydrationWarning
                disableTitle
              />
            </span>
          </TooltipWrapper>
        </div>
      </div>

      {/* Install / Download — list variant only (hidden in grid, revealed on
          hover via CSS). Rendered only when the backend supplies the URLs, so
          the card still works before the backend deploys those fields — see the
          TODO(backend-listing-fields) note on PackageListing. */}
      {packageData.install_url || packageData.download_url ? (
        <div className="card-package__actions">
          {packageData.install_url ? (
            <NewButton
              primitiveType="link"
              href={packageData.install_url}
              csVariant="accent"
              csSize="small"
              rootClasses="card-package__install"
            >
              <NewIcon csMode="inline">
                <ThunderstoreLogo />
              </NewIcon>
              Install
            </NewButton>
          ) : null}
          {packageData.download_url ? (
            <NewButton
              primitiveType="link"
              href={packageData.download_url}
              csVariant="secondary"
              csSize="small"
              aria-label="Download"
              rootClasses="card-package__download"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faDownload} />
              </NewIcon>
              {/* Hidden (icon-only) when the card is narrow — see CardPackage.css. */}
              <span className="card-package__download-label">Download</span>
            </NewButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

CardPackage.displayName = "CardPackage";
