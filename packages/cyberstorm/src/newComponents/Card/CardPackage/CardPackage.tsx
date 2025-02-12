import {
  faDownload,
  faThumbTack,
  faWarning,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageListing } from "@thunderstore/dapper/types";

import { numberWithSpaces, formatInteger } from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag, NewMetaItem } from "../../..";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";
import "./CardPackage.css";
import { faLips, faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { RelativeTime } from "../../../components/RelativeTime/RelativeTime";

interface Props {
  packageData: PackageListing;
}

export function CardPackage(props: Props) {
  const { packageData } = props;
  const updateTime = Date.parse(packageData.last_updated);
  const updateTimeDelta = Math.round((Date.now() - updateTime) / 86400000);
  const isNew = updateTimeDelta < 3;

  return (
    <div className="card-package">
      <NewLink
        tabIndex={-1}
        primitiveType="cyberstormLink"
        linkId="Package"
        community={packageData.community_identifier}
        namespace={packageData.namespace}
        package={packageData.name}
        title={`${packageData.name} by ${packageData.namespace}`}
      >
        {packageData.is_pinned ||
        packageData.is_nsfw ||
        packageData.is_deprecated ||
        isNew ? (
          <div className="card-package__tag">
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
            {isNew ? (
              <NewTag csSize="small" csModifiers={["dark"]} csVariant="green">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faSparkles} />
                </NewIcon>
                New
              </NewTag>
            ) : null}
          </div>
        ) : undefined}
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

        {packageData.description ? (
          <p className="card-package__description">{packageData.description}</p>
        ) : null}
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

        <div className="card-package__footer">
          <div className="card-package__meta">
            <TooltipWrapper
              tooltipText={`${numberWithSpaces(
                packageData.download_count
              )} Downloads`}
            >
              <NewMetaItem csSize="12">
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faDownload} />
                </NewIcon>
                {formatInteger(packageData.download_count)}
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
            <TooltipWrapper
              tooltipText={`${numberWithSpaces(
                packageData.rating_count
              )} Upvotes`}
            >
              <NewMetaItem csSize="12">
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </NewIcon>
                {formatInteger(packageData.rating_count)}
              </NewMetaItem>
            </TooltipWrapper>
          </div>
          <span className="card-package__updated">
            Last updated:
            <RelativeTime
              time={packageData.last_updated}
              suppressHydrationWarning
            />
          </span>
        </div>
      </div>
    </div>
  );
}

CardPackage.displayName = "CardPackage";
