import { faBoxOpen, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import styles from "./CommunityCard.module.css";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";
import { MetaItem } from "../MetaItem/MetaItem";
import { formatInteger, numberWithSpaces } from "../../utils/utils";
import { Tooltip } from "../Tooltip/Tooltip";

interface Props {
  community: Community;
}

/**
 * Cyberstorm CommunityCard component
 */
export function CommunityCard(props: Props) {
  const { community } = props;

  return (
    <div className={styles.root}>
      <a href={`/c/${community.identifier}`}>
        <ImageWithFallback
          src={community.cover_image_url}
          type="community"
          rootClass={styles.imageWrapper}
        />
      </a>
      <div className={styles.title} title={community.name}>
        <a href={`/c/${community.identifier}`}>{community.name}</a>
      </div>
      <div className={styles.metaItemList}>
        <Tooltip
          content={`${numberWithSpaces(
            community.total_package_count
          )} Packages`}
          side="bottom"
        >
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_package_count)}
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
          />
        </Tooltip>
        <Tooltip
          content={`${numberWithSpaces(
            community.total_download_count
          )} Downloads`}
          side="bottom"
        >
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_download_count)}
            icon={<FontAwesomeIcon icon={faDownload} />}
          />
        </Tooltip>
      </div>
    </div>
  );
}

CommunityCard.displayName = "CommunityCard";
