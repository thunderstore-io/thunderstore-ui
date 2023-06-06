import styles from "./CommunityInfo.module.css";
import { GameIcon } from "../../../GameIcon/GameIcon";
import { MetaItem } from "../../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faBoxOpen,
  faServer,
} from "@fortawesome/pro-regular-svg-icons";
import { Button } from "../../../Button/Button";
import { Title } from "../../../Title/Title";
import { formatInteger } from "../../../../utils/utils";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Link } from "../../../Link/Link";

export interface PackageListCommunityInfoProps {
  title?: string;
  description?: string;
  imageSource?: string;
  packageCount: number;
  downloadCount: number;
  serverCount: number;
}

/**
 * Cyberstorm PackageList's CommunityInfo
 */
export function CommunityInfo(props: PackageListCommunityInfoProps) {
  const {
    title = "",
    description,
    imageSource,
    packageCount,
    downloadCount,
    serverCount,
  } = props;
  return (
    <div className={styles.root}>
      <GameIcon src={imageSource} />
      <div className={styles.info}>
        <Title text={title} />
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{description}</p>
          <Button
            label="Show more"
            colorScheme="transparentDefault"
            size="small"
          />
        </div>
        <div className={styles.meta}>
          <MetaItem
            label={formatInteger(packageCount) + " Packages"}
            icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
            colorScheme="tertiary"
            size="large"
          />
          <MetaItem
            label={formatInteger(downloadCount) + " Downloads"}
            icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
            colorScheme="tertiary"
            size="large"
          />
          <MetaItem
            label={formatInteger(serverCount) + " Servers"}
            icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
            colorScheme="tertiary"
            size="large"
          />
          <Link
            leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
            label="Join our community"
            externalUrl="https://discord.gg/5MbXZvd"
          />
        </div>
      </div>
    </div>
  );
}

CommunityInfo.displayName = "CommunityInfo";
