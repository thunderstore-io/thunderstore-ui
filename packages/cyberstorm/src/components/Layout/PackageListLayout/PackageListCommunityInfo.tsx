import React from "react";
import styles from "./PackageListCommunityInfo.module.css";
import { GameIcon } from "../../GameIcon/GameIcon";
import { Title } from "../../Title/Title";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../../Link/Link";

export interface PackageListCommunityInfoProps {
  title?: string;
}

/**
 * Cyberstorm PackageListCommunityInfo
 */
export const PackageListCommunityInfo: React.FC<
  PackageListCommunityInfoProps
> = (props) => {
  const { title } = props;
  return (
    <div className={styles.root}>
      <GameIcon />
      <div className={styles.info}>
        <Title text={title} />
        <div className={styles.meta}>
          <MetaItem
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
            label="1,342 Packages"
          />
          <MetaItem
            label="4,5M Downloads"
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
          />
          <MetaItem
            label="138 Servers"
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
          />
          <Link label="Join the Community" />
        </div>
      </div>
    </div>
  );
};

PackageListCommunityInfo.displayName = "PackageListCommunityInfo";
PackageListCommunityInfo.defaultProps = { title: "" };
