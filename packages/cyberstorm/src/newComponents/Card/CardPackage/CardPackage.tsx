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
  // TODO: Remove this customization when /p is doned
  domain: string;
}

export function CardPackage(props: Props) {
  const { packageData, domain } = props;
  const updateTime = Date.parse(packageData.last_updated);
  const updateTimeDelta = Math.round((Date.now() - updateTime) / 86400000);
  const isNew = updateTimeDelta < 3;
  // const currentUrlWithPath =
  //   window.location.port !== ""
  //     ? `${window.location.protocol}${window.location.hostname}${window.location.port}/${window.location.pathname}`
  //     : `${window.location.protocol}${window.location.hostname}${window.location.port}/${window.location.pathname}`;

  return (
    <div className="ts-cardpackage">
      <NewLink
        tabIndex={-1}
        // TODO: Remove this customization when /p is doned
        primitiveType="link"
        href={`${domain}/c/${packageData.community_identifier}/p/${packageData.namespace}/${packageData.name}/`}
        // primitiveType="cyberstormLink"
        // linkId="Package"
        // community={packageData.community_identifier}
        // namespace={packageData.namespace}
        // package={packageData.name}
        title={`${packageData.name} by ${packageData.namespace}`}
      >
        {packageData.is_pinned ||
        packageData.is_nsfw ||
        packageData.is_deprecated ||
        isNew ? (
          <div className="ts-cardpackage__tag">
            {packageData.is_pinned ? (
              <NewTag csModifiers={["dark"]} csVariant="blue">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faThumbTack} />
                </NewIcon>
                Pinned
              </NewTag>
            ) : null}
            {packageData.is_nsfw ? (
              <NewTag csModifiers={["dark"]} csVariant="pink">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faLips} />
                </NewIcon>
                NSFW
              </NewTag>
            ) : null}
            {packageData.is_deprecated ? (
              <NewTag csModifiers={["dark"]} csVariant="yellow">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faWarning} />
                </NewIcon>
                Deprecated
              </NewTag>
            ) : null}
            {isNew ? (
              <NewTag csModifiers={["dark"]} csVariant="green">
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
          rootClasses="ts-cardpackage__imagewrapper"
          square
          intrinsicWidth={256}
          intrinsicHeight={256}
        />
      </NewLink>

      <div className="ts-cardpackage__content">
        <div className="ts-cardpackage__info">
          <NewLink
            // TODO: Remove this customization when /p is doned
            primitiveType="link"
            href={`${domain}/c/${packageData.community_identifier}/p/${packageData.namespace}/${packageData.name}/`}
            // primitiveType="cyberstormLink"
            // linkId="Package"
            // community={packageData.community_identifier}
            // namespace={packageData.namespace}
            // package={packageData.name}
            rootClasses="ts-cardpackage__title"
            title={packageData.name}
          >
            {packageData.name}
          </NewLink>

          <div className="ts-cardpackage__author">
            <span className="ts-cardpackage__author__prefix">by</span>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Team"
              community={packageData.community_identifier}
              team={packageData.namespace}
              title={packageData.namespace}
              rootClasses="ts-cardpackage__author__link"
            >
              {packageData.namespace}
            </NewLink>
          </div>
        </div>

        {packageData.description ? (
          <p className="ts-cardpackage__description">
            {packageData.description}
          </p>
        ) : null}
        <div className="ts-cardpackage__categoryWrapper">
          {packageData.categories.length
            ? packageData.categories.map((c, index) => (
                <NewTag
                  csMode="link"
                  href={`/c/${packageData.community_identifier}/?includedCategories=${c.id}`}
                  key={`category_${c}_${index}`}
                  csVariant="primary"
                  csSize="small"
                  csModifiers={["dark", "hoverable"]}
                >
                  {c.name}
                </NewTag>
              ))
            : null}
        </div>

        <div className="ts-cardpackage__footer">
          <div className="ts-cardpackage__footer__metaItemWrapper">
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
              <div className="ts-cardpackage__footer__metaitem">
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
          <span className="ts-cardpackage__footer__updatetext">
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
