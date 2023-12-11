import { faBoxOpen, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import styles from "./CommunityCard.module.css";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";
import { CommunityLink } from "../Links/Links";
import { MetaItem } from "../MetaItem/MetaItem";
import { formatInteger } from "../../utils/utils";

interface Props {
  community: Community;
}

/**
 * Cyberstorm CommunityCard component
 */
export function CommunityCard(props: Props) {
  const { community } = props;

  return (
    <CommunityLink community={community.identifier}>
      <div className={styles.root}>
        <ImageWithFallback
          src={community.icon_url}
          type="community"
          rootClass={styles.imageWrapper}
        />
        <div className={styles.title} title={community.name}>
          {community.name}
        </div>
        <div className={styles.metaItemList}>
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_package_count)}
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
          />
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_download_count)}
            icon={<FontAwesomeIcon icon={faDownload} />}
          />
        </div>
      </div>
    </CommunityLink>
  );
}

CommunityCard.displayName = "CommunityCard";
