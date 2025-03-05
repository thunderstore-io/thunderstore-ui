import {
  faDownload,
  faThumbTack,
  faWarning,
  faThumbsUp,
  faCodeMerge,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageListing } from "@thunderstore/dapper/types";

import {
  classnames,
  componentClasses,
  formatInteger,
} from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag, NewMetaItem } from "../../..";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";
import "./CardPackage.css";
import { faLips } from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "../../../components/RelativeTime/RelativeTime";
import { CardPackageVariants } from "@thunderstore/cyberstorm-theme/src/components";
import ago from "s-ago";
import {
  CardPackageModifiers,
  CardPackageSizes,
} from "@thunderstore/cyberstorm-theme/src/components/CardPackage/CardPackage";

interface Props {
  packageData: PackageListing;
  isLiked: boolean;
  packageLikeAction?: () => void;
  csVariant?: CardPackageVariants;
  csSize?: CardPackageSizes;
  csModifiers?: CardPackageModifiers;
  rootClasses?: string;
}

export function CardPackage(props: Props) {
  const {
    packageData,
    isLiked,
    packageLikeAction,
    csVariant = "card",
    csSize = "medium",
    csModifiers,
    rootClasses,
  } = props;
  const updateTime = Date.parse(packageData.last_updated);
  const updateTimeDelta = Math.round((Date.now() - updateTime) / 86400000);
  const isUpdated = updateTimeDelta < 3;

  const tags = (
    <div className="card-package__tags">
      {packageData.categories.length
        ? packageData.categories.map((c, index) => (
            <NewTag
              csMode="link"
              href={`/c/${packageData.community_identifier}/?includedCategories=${c.id}`}
              key={`category_${c}_${index}`}
              csVariant="primary"
              csSize="xsmall"
              csModifiers={["dark", "hoverable"]}
            >
              <span>{c.name}</span>
            </NewTag>
          ))
        : null}
    </div>
  );

  const description = (
    <p className="card-package__description">{packageData.description}</p>
  );

  const meta = (
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
      {/* <TooltipWrapper
      tooltipText={`Latest version: TODO ADD FIELD TO ENDPOINT`}
    >
      <div className="card-package__footer__metaitem">
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCodeBranch} />
        </NewIcon>
        TODO
      </div>
    </TooltipWrapper> */}
      {csVariant === "fullWidth" ? (
        <TooltipWrapper
          tooltipText={`Last updated: ${ago(
            new Date(packageData.last_updated)
          )}`}
        >
          <NewMetaItem csSize="12">
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faClockRotateLeft} />
            </NewIcon>
            {ago(new Date(packageData.last_updated))}
          </NewMetaItem>
        </TooltipWrapper>
      ) : null}
    </div>
  );

  const cardFooter = (
    <div className="card-package__footer">
      {csVariant === "fullWidth" ? tags : null}

      {csVariant === "card" ? (
        <>
          {meta}
          <span className="card-package__updated">
            Last updated:
            <RelativeTime
              time={packageData.last_updated}
              suppressHydrationWarning
            />
          </span>
        </>
      ) : null}
    </div>
  );

  return (
    <div
      className={classnames(
        "card-package",
        ...componentClasses("card-package", csVariant, csSize, csModifiers),
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
        title={`${packageData.name} by ${packageData.namespace}`}
      >
        {csVariant === "card" &&
        (packageData.is_pinned ||
          packageData.is_nsfw ||
          packageData.is_deprecated ||
          isUpdated) ? (
          <div className="card-package__image-tags">
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
            {isUpdated ? (
              <NewTag csSize="small" csVariant="green">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faCodeMerge} />
                </NewIcon>
                Updated
              </NewTag>
            ) : null}
          </div>
        ) : null}
        <Image
          src={packageData.icon_url}
          cardType="package"
          rootClasses="card-package__image-wrapper"
          square
          intrinsicWidth={256}
          intrinsicHeight={256}
        />
      </NewLink>

      <div className="card-package__content">
        <div className="card-package__info">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={packageData.community_identifier}
            namespace={packageData.namespace}
            package={packageData.name}
            rootClasses="card-package__title"
            title={packageData.name}
          >
            {packageData.name}
          </NewLink>

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

        {["card", "featured", "fullWidth"].includes(csVariant) &&
        packageData.description
          ? description
          : null}

        {["card", "featured"].includes(csVariant) ? tags : null}
        {csVariant === "featured" ? meta : null}

        {csVariant === "card" ? cardFooter : null}
      </div>
      {csVariant === "fullWidth" ? cardFooter : null}
    </div>
  );
}

CardPackage.displayName = "CardPackage";
