import React, { ReactNode } from "react";
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
import { PackageFlag } from "../PackageFlag/PackageFlag";
import { formatInteger } from "../../utils/utils";
import { PackagePreview } from "../../schema";

const defaultImageSrc = "";

export interface PackageCardProps {
  packageData: PackagePreview;
  colorScheme?: string;
}

/**
 * Cyberstorm PackageCard component
 */
export const PackageCard: React.FC<PackageCardProps> = (props) => {
  const { packageData, colorScheme, ...forwardedProps } = props;

  const authorLink = ""; //TODO: author link
  //TODO: convert <a> tags into link components!
  //TODO: Use LastUpdated component once one is developed

  return (
    <div
      className={`${styles.root} ${getStyle(colorScheme)}`}
      {...forwardedProps}
    >
      <a
        href={packageData.name}
        className={styles.imageWrapper}
        title={packageData.name}
      >
        <img
          src={
            packageData.imageSource ? packageData.imageSource : defaultImageSrc
          }
          className={styles.image}
          alt={packageData.name}
        />
        {getPackageFlags(
          packageData.isPinned,
          packageData.isNsfw,
          packageData.isDeprecated
        )}
      </a>

      <div className={styles.content}>
        <a href={packageData.name} className={styles.title}>
          {packageData.name}
        </a>

        {packageData.author ? (
          <div className={styles.author}>
            <span className={styles.author_prefix}>by</span>
            <a className={styles.author_label} href={authorLink}>
              {packageData.author}
            </a>
          </div>
        ) : null}

        {packageData.description ? (
          <p className={styles.description}>{packageData.description}</p>
        ) : null}
      </div>

      {packageData.categories.length > 0 ? (
        <div className={styles.categoryWrapper}>
          {packageData.categories.map((c, index) => (
            <Tag
              key={`category_${c}_${index}`}
              label={c}
              size="small"
              colorScheme="default"
            />
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
};

PackageCard.displayName = "PackageCard";
PackageCard.defaultProps = {
  colorScheme: "default",
};

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
      <PackageFlag
        key="flag_pinned"
        label="Pinned"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isNsfw) {
    flagList.push(
      <PackageFlag
        key="flag_nsfw"
        label="NSFW"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isDeprecated) {
    flagList.push(
      <PackageFlag
        key="flag_deprecated"
        label="Deprecated"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
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
        colorScheme="tertiary"
      />

      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faThumbsUp} />}
        label={formatInteger(likes)}
        colorScheme="tertiary"
      />

      <div className={styles.metaItem__last}>
        <MetaItem
          icon={<FontAwesomeIcon fixedWidth icon={faHardDrive} />}
          label={formatInteger(size)}
          colorScheme="tertiary"
        />
      </div>
    </div>
  );
}
