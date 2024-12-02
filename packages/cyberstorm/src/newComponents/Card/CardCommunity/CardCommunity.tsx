import {
  faBoxOpen,
  faDownload,
  faHandSparkles,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import { numberWithSpaces, formatInteger } from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag, NewMetaItem } from "../../..";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";
import "./CardCommunity.css";

interface Props {
  community: Community;
  isPopular?: boolean;
  isNew?: boolean;
}

export function CardCommunity(props: Props) {
  const { community, isPopular, isNew } = props;

  return (
    <div className="ts-cardcommunity">
      {isPopular || isNew ? (
        <div className="ts-cardcommunity__tag">
          {isPopular ? (
            <NewTag csModifiers={["dark"]} csVariant="orange">
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faFire} />
              </NewIcon>
              Popular
            </NewTag>
          ) : null}
          {isNew ? (
            <NewTag csModifiers={["dark"]} csVariant="green">
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faHandSparkles} />
              </NewIcon>
              New
            </NewTag>
          ) : null}
        </div>
      ) : undefined}
      <NewLink
        primitiveType="cyberstormLink"
        tabIndex={-1}
        linkId="Community"
        community={community.identifier}
        title={community.name}
      >
        <Image
          src={community.cover_image_url}
          cardType="community"
          rootClasses="ts-cardcommunity__imagewrapper"
          intrinsicWidth={360}
          intrinsicHeight={480}
        />
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        rootClasses="ts-cardcommunity__title"
      >
        {community.name}
      </NewLink>
      <div className="ts-cardcommunity__metaitemlist">
        <TooltipWrapper
          tooltipText={`${numberWithSpaces(
            community.total_package_count
          )} Packages`}
        >
          <NewMetaItem csSize="12">
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faBoxOpen} />
            </NewIcon>
            {formatInteger(community.total_package_count)}
          </NewMetaItem>
        </TooltipWrapper>
        <TooltipWrapper
          tooltipText={`${numberWithSpaces(
            community.total_download_count
          )} Downloads`}
        >
          <NewMetaItem csSize="12">
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDownload} />
            </NewIcon>
            {formatInteger(community.total_download_count)}
          </NewMetaItem>
        </TooltipWrapper>
      </div>
    </div>
  );
}

CardCommunity.displayName = "CardCommunity";
