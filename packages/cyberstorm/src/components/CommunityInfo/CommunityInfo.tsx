import React from "react";
import styles from "./CommunityInfo.module.css";
import { GameIcon } from "../GameIcon/GameIcon";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faGamepad,
  faBoxOpen,
  faServer,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";

export interface PackageListCommunityInfoProps {
  title?: string;
}

/**
 * Cyberstorm PackageListCommunityInfo
 */
export const CommunityInfo: React.FC<PackageListCommunityInfoProps> = (
  props
) => {
  const { title } = props;
  return (
    <div className={styles.root}>
      <GameIcon />
      <div className={styles.info}>
        <Title text={title} />
        <div className={styles.meta}>
          <MetaItem
            icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
            label="1,342 Packages"
            colorScheme="tertiary"
            size="large"
          />
          <MetaItem
            label="4,5M Downloads"
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
            colorScheme="tertiary"
            size="large"
          />
          <MetaItem
            label="138 Servers"
            icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
            colorScheme="tertiary"
            size="large"
          />
          <Button
            label={"Join the Community"}
            leftIcon={<FontAwesomeIcon icon={faGamepad} fixedWidth />}
            rightIcon={<FontAwesomeIcon icon={faArrowUp} fixedWidth />}
            colorScheme="transparentPrimary"
          />
        </div>
      </div>
    </div>
  );
};

CommunityInfo.displayName = "PackageListCommunityInfo";
CommunityInfo.defaultProps = { title: "" };
