import styles from "./CommunityCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { formatInteger } from "../../utils/utils";
import { CommunityPreview } from "@thunderstore/dapper/schema";
import { CommunityLink } from "../Links/Links";

export interface GameIconProps {
  communityData: CommunityPreview;
}

const COMMUNITY_PLACEHOLDER_IMAGE_SOURCE = "";

/**
 * Cyberstorm CommunityCard component
 */
export function CommunityCard(props: GameIconProps) {
  const { communityData } = props;
  return (
    <CommunityLink community={communityData.name}>
      <div className={styles.root}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            alt={communityData.name}
            src={
              communityData.portrait_image_url ||
              COMMUNITY_PLACEHOLDER_IMAGE_SOURCE
            }
          />
        </div>
        <div className={styles.title} title={communityData.name}>
          {communityData.name}
        </div>
        <div className={styles.metaItemList}>
          <MetaItem
            size="medium"
            colorScheme="accent"
            label={formatInteger(communityData.total_package_count)}
            icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
          />
          <MetaItem
            size="medium"
            colorScheme="accent"
            label={formatInteger(communityData.total_download_count)}
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
          />
          <MetaItem
            size="medium"
            colorScheme="accent"
            label={formatInteger(communityData.total_server_count)}
            icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
          />
        </div>
      </div>
    </CommunityLink>
  );
}

CommunityCard.displayName = "CommunityCard";
