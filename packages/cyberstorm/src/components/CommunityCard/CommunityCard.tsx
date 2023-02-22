import React from "react";
import styles from "./CommunityCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

export interface GameIconProps {
  imageSrc?: string;
}

/**
 * Cyberstorm CommunityCard component
 */
export const CommunityCard: React.FC<GameIconProps> = (props) => {
  const { imageSrc } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"Community image"} src={imageSrc} />
      <div className={styles.title}>V Rising</div>
      <div className={styles.metaItemList}>
        <MetaItem
          label="1,342"
          icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
        />
        <MetaItem
          label="4,5M"
          icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
        />
        <MetaItem
          label="138"
          icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
        />
      </div>
    </div>
  );
};

CommunityCard.displayName = "CommunityCard";
CommunityCard.defaultProps = { imageSrc: "/images/game.png" };
