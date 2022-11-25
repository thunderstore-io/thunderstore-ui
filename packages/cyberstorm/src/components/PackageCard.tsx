import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageCard.module.css";
import { MetaItem } from "./MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faThumbsUp,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";
import { Tag } from "./Tag";

const defaultImageSrc = "";

export interface PackageCardProps {
  packageName?: string;
  description?: string;
  imageSrc?: string;
  downloadCount?: string;
  likes?: string;
  size?: string;
  author?: string;
  link?: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  packageCardStyle?: "packageCard__default";
  categories: string[];
}

/**
 * Cyberstorm PackageCard component
 */
export const PackageCard: React.FC<PackageCardProps> = (props) => {
  const {
    packageName,
    description,
    imageSrc,
    downloadCount,
    likes,
    size,
    author,
    link,
    lastUpdated,
    isPinned,
    isNsfw,
    isDeprecated,
    packageCardStyle,
    categories,
  } = props;

  const authorLink = ""; //TODO: author link

  const categoryList: ReactNode[] = [];
  categories.forEach((category) =>
    categoryList.push(<Tag tagSize="small" label={category} />)
  );

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.packageCard} ${styles[packageCardStyle!]}`}
    >
      <div className={styles.packageCardImageWrapper}>
        <img
          src={imageSrc ? imageSrc : defaultImageSrc}
          className={styles.packageCardImage}
          alt="package card"
        />
      </div>

      <div className={styles.packageCardContent}>
        {packageName ? (
          <a href={link} className={styles.packageCardPackageName}>
            {packageName}
          </a>
        ) : null}
        <div className={styles.packageCardAuthor}>
          <span className={styles.packageCardAuthor_prefix}>by </span>
          <a className={styles.packageCardAuthor_author} href={authorLink}>
            {author}
          </a>
        </div>
        <p className={styles.packageCardDescription}>{description}</p>

        <div className={styles.packageCardCategoryWrapper}>{categoryList}</div>
      </div>

      <div className={styles.packageCardFooter}>
        <p className={styles.packageCardLastUpdated}>
          {"Last updated: " + lastUpdated}
        </p>
        <div className={styles.packageCardMetaItemWrapper}>
          <MetaItem
            icon={
              <FontAwesomeIcon
                fixedWidth={true}
                icon={faDownload}
                className={"PackageCardmetaItemIcon"}
              />
            }
            label={downloadCount}
            metaItemStyle={"metaItem__tertiary"}
          />

          <MetaItem
            icon={
              <FontAwesomeIcon
                fixedWidth={true}
                icon={faThumbsUp}
                className={"PackageCardmetaItemIcon"}
              />
            }
            label={likes}
            metaItemStyle={"metaItem__tertiary"}
          />

          <MetaItem
            icon={
              <FontAwesomeIcon
                fixedWidth={true}
                icon={faCompactDisc}
                className={"PackageCardmetaItemIcon"}
              />
            }
            label={size}
            metaItemStyle={"metaItem__tertiary"}
          />
        </div>
      </div>
    </div>
  );
};

PackageCard.defaultProps = {
  packageCardStyle: "packageCard__default",
  categories: [],
};
