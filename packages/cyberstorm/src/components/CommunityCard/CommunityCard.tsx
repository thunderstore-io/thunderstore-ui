import styles from "./CommunityCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { formatInteger } from "../../utils/utils";
import { CommunityPreview } from "../../schema";
import { CommunityLink } from "../Links/Links";

export interface GameIconProps {
  communityData: CommunityPreview;
}

/**
 * Cyberstorm CommunityCard component
 */
export function CommunityCard(props: GameIconProps) {
  const { communityData } = props;
  return (
    <div className={styles.root}>
      <CommunityLink community={communityData.name}>
        <img
          className={styles.image}
          alt={communityData.name}
          src={communityData.imageSource}
        />
        <div className={styles.title}>{communityData.name}</div>
      </CommunityLink>
      <div className={styles.metaItemList}>
        <MetaItem
          label={formatInteger(communityData.packageCount)}
          icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
        />
        <MetaItem
          label={formatInteger(communityData.downloadCount)}
          icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
        />
        <MetaItem
          label={formatInteger(communityData.serverCount)}
          icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
        />
      </div>
    </div>
  );
}

CommunityCard.displayName = "CommunityCard";
CommunityCard.defaultProps = {};
