import { ReactNode } from "react";
import styles from "./PackageCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faThumbsUp,
  faHardDrive,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { Tag } from "../Tag/Tag";
import { formatInteger } from "../../utils/utils";
import { PackagePreview } from "@thunderstore/dapper/schema";
import { PackageLink, UserLink } from "../Links/Links";

export interface PackageCardProps {
  packageData: PackagePreview;
  colorScheme?: "default";
  community?: string;
}

/**
 * Cyberstorm PackageCard component
 */
export function PackageCard(props: PackageCardProps) {
  const {
    packageData,
    colorScheme = "default",
    community,
    ...forwardedProps
  } = props;

  return (
    <div
      className={`${styles.root} ${getStyle(colorScheme)}`}
      {...forwardedProps}
    >
      <div className={styles.imageWrapper}>
        <PackageLink
          namespace={packageData.namespace}
          package={packageData.name}
          community={packageData.community}
        >
          {packageData.imageSource ? (
            <img
              className={styles.image}
              src={packageData.imageSource}
              alt={packageData.name}
            />
          ) : null}
          {getPackageFlags(
            packageData.isPinned,
            packageData.isNsfw,
            packageData.isDeprecated
          )}
        </PackageLink>
      </div>

      <div className={styles.content}>
        <PackageLink
          namespace={packageData.namespace}
          package={packageData.name}
          community={packageData.community}
        >
          <div className={styles.title}>{packageData.name}</div>
        </PackageLink>

        {packageData.author ? (
          <div className={styles.author}>
            <span className={styles.author_prefix}>by</span>
            <UserLink user={packageData.author}>
              <div className={styles.author_label}>{packageData.author}</div>
            </UserLink>
          </div>
        ) : null}

        {packageData.description ? (
          <p className={styles.description}>{packageData.description}</p>
        ) : null}
      </div>

      {packageData.categories?.length > 0 ? (
        <div className={styles.categoryWrapper}>
          {packageData.categories.map((c, index) => (
            <div key={`category_${c}_${index}`} className={styles.categoryTag}>
              {c.name}
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.footer}>
        {packageData.lastUpdated ? (
          <p className={styles.lastUpdated}>
            {"Last updated: " + packageData.lastUpdated}
          </p>
        ) : null}

        {getMetaItemList(
          packageData.downloadCount,
          packageData.likes,
          packageData.size
        )}
      </div>
    </div>
  );
}

PackageCard.displayName = "PackageCard";

const getStyle = (scheme: PackageCardProps["colorScheme"] = "default") => {
  return {
    default: styles.packageCard__default,
  }[scheme];
};

function getPackageFlags(
  isPinned: boolean | undefined,
  isNsfw: boolean | undefined,
  isDeprecated: boolean | undefined
) {
  if (!isPinned && !isNsfw && !isDeprecated) {
    return null;
  }
  const flagList: ReactNode[] = [];
  if (isPinned) {
    flagList.push(
      <Tag
        key="flag_pinned"
        label="Pinned"
        colorScheme="info"
        leftIcon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isNsfw) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="NSFW"
        colorScheme="info"
        leftIcon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isDeprecated) {
    flagList.push(
      <Tag
        key="flag_deprecated"
        label="Deprecated"
        colorScheme="info"
        leftIcon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  return <div className={styles.flagWrapper}>{flagList}</div>;
}

function getMetaItemList(downloadCount: number, likes: number, size: number) {
  return (
    <div className={styles.metaItemWrapper}>
      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faDownload} />}
        label={formatInteger(downloadCount)}
        colorScheme="accent"
      />

      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faThumbsUp} />}
        label={formatInteger(likes)}
        colorScheme="accent"
      />

      <div className={styles.metaItem__last}>
        <MetaItem
          icon={<FontAwesomeIcon fixedWidth icon={faHardDrive} />}
          label={`${size} MB`}
          colorScheme="accent"
        />
      </div>
    </div>
  );
}
