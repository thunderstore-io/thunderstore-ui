import React from "react";
import styles from "./CommunityCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import { getCommunityPreviewDummyData } from "../../dummyData/generate";
import { formatInteger, strToHashInt } from "../../utils/utils";

export interface GameIconProps {
  communityId: string;
}

/**
 * Cyberstorm CommunityCard component
 */
export const CommunityCard: React.FC<GameIconProps> = (props) => {
  const { communityId } = props;
  const communityPreview = getData(communityId);
  return (
    <div className={styles.root}>
      <img
        className={styles.image}
        alt={"Community"}
        src={communityPreview.imageSource}
      />
      <div className={styles.title}>{communityPreview.name}</div>
      <div className={styles.metaItemList}>
        <MetaItem
          label={formatInteger(communityPreview.packageCount)}
          icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
        />
        <MetaItem
          label={formatInteger(communityPreview.downloadCount)}
          icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
        />
        <MetaItem
          label={formatInteger(communityPreview.serverCount)}
          icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
        />
      </div>
    </div>
  );
};

CommunityCard.displayName = "CommunityCard";
CommunityCard.defaultProps = {};

function getData(communityId: string) {
  return getCommunityPreviewDummyData(strToHashInt(communityId));
}
