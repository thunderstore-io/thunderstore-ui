import {
  faBoxOpen,
  faDownload,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import { formatInteger } from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag, NewMetaItem } from "../../..";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";
import "./CardCommunity.css";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";

interface Props {
  community: Community;
  isPopular?: boolean;
  isNew?: boolean;
}

export function CardCommunity(props: Props) {
  const { community, isPopular, isNew } = props;

  return (
    <div className="card-community">
      {isPopular || isNew ? (
        <div className="card-community__tag">
          {isPopular ? (
            <NewTag csModifiers={["dark"]} csVariant="orange" csSize="small">
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faFire} />
              </NewIcon>
              Popular
            </NewTag>
          ) : null}
          {isNew ? (
            <NewTag csModifiers={["dark"]} csVariant="green" csSize="small">
              <NewIcon noWrapper csMode="inline">
                <FontAwesomeIcon icon={faSparkles} />
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
          rootClasses="card-community__image"
          intrinsicWidth={360}
          intrinsicHeight={480}
        />
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        rootClasses="card-community__title"
      >
        {community.name}
      </NewLink>
      <div className="card-community__meta">
        <TooltipWrapper
          tooltipText={`${formatInteger(
            community.total_package_count,
            "standard"
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
          tooltipText={`${formatInteger(
            community.total_download_count,
            "standard"
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
