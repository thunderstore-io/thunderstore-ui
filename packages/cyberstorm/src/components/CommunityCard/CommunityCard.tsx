import styles from "./CommunityCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGamepadModern } from "@fortawesome/pro-solid-svg-icons";
import { formatInteger } from "../../utils/utils";
import { Community } from "@thunderstore/dapper/types";
import { CommunityLink } from "../Links/Links";
import { Icon } from "../Icon/Icon";

interface Props {
  community: Community;
}

/**
 * Cyberstorm CommunityCard component
 */
export function CommunityCard(props: Props) {
  const { community } = props;

  return (
    <CommunityLink community={community.name}>
      <div className={styles.root}>
        <div className={styles.imageWrapper}>
          {community.icon_url ? (
            <div className={`${styles.imageContent} ${styles.fullWidth}`}>
              <img className={styles.image} alt="" src={community.icon_url} />
            </div>
          ) : (
            <div className={styles.imageContent}>
              <Icon>
                <FontAwesomeIcon icon={faGamepadModern} />
              </Icon>
            </div>
          )}
        </div>
        <div className={styles.title} title={community.name}>
          {community.name}
        </div>
        <div className={styles.metaItemList}>
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_package_count)}
            icon={
              <Icon>
                <FontAwesomeIcon icon={faBoxOpen} />
              </Icon>
            }
          />
          <MetaItem
            colorScheme="accent"
            label={formatInteger(community.total_download_count)}
            icon={
              <Icon>
                <FontAwesomeIcon icon={faDownload} />
              </Icon>
            }
          />
        </div>
      </div>
    </CommunityLink>
  );
}

CommunityCard.displayName = "CommunityCard";
