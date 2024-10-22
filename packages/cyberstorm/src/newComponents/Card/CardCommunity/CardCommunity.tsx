import {
  faBoxOpen,
  faDownload,
  faHandSparkles,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import styles from "./CardCommunity.module.css";
import {
  numberWithSpaces,
  formatInteger,
  classnames,
} from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag } from "../../..";
import { TooltipWrapper } from "../../../primitiveComponents/utils/utils";

interface Props {
  community: Community;
  isPopular?: boolean;
  isNew?: boolean;
}

export function CardCommunity(props: Props) {
  const { community, isPopular, isNew } = props;

  return (
    <div className={classnames(styles.root, "fontSizeM", "fontWeightBold")}>
      <div className={styles.tag}>
        {isPopular ? (
          <NewTag dark csColor="orange">
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faFire} />
            </NewIcon>
            Popular
          </NewTag>
        ) : null}
        {isNew ? (
          <NewTag dark csColor="green">
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faHandSparkles} />
            </NewIcon>
            New
          </NewTag>
        ) : null}
      </div>
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
          rootClasses={styles.imageWrapper}
        />
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        rootClasses={styles.title}
        csVariant="primary"
        csTextStyles={["lineHeightAuto"]}
      >
        {community.name}
      </NewLink>
      <div className={styles.metaItemList}>
        <TooltipWrapper
          tooltipText={`${numberWithSpaces(
            community.total_package_count
          )} Packages`}
        >
          <div className={classnames(styles.metaItem, "fontSizeXS")}>
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faBoxOpen} />
            </NewIcon>
            {formatInteger(community.total_package_count)}
          </div>
        </TooltipWrapper>
        <TooltipWrapper
          tooltipText={`${numberWithSpaces(
            community.total_download_count
          )} Downloads`}
        >
          <div className={classnames(styles.metaItem, "fontSizeXS")}>
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faDownload} />
            </NewIcon>
            {formatInteger(community.total_download_count)}
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}

CardCommunity.displayName = "CardCommunity";
