import React from "react";
import styles from "./PackageListCommunityInfo.module.css";
import { GameIcon } from "../../GameIcon/GameIcon";
import { Title } from "../../Title/Title";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../../Link/Link";
import { CommunityLink } from "../../Links/Links";

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
          <CommunityLink community={"Discord"}>
            <span className={styles.discordLink}>
              <FontAwesomeIcon icon={faGamepad} fixedWidth />
              <span>Join the Community</span>
            </span>
          </CommunityLink>
        </div>
      </div>
    </div>
  );
};

PackageListCommunityInfo.displayName = "PackageListCommunityInfo";
PackageListCommunityInfo.defaultProps = { title: "" };
