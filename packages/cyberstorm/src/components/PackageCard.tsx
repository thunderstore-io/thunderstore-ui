import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageCard.module.css";
import { MetaItem } from "./MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faThumbsUp,
  faHardDrive,
} from "@fortawesome/free-solid-svg-icons";
import { Tag } from "./Tag";

const defaultImageSrc = "";

export interface PackageCardProps {
  packageName: string;
  description?: string;
  imageSrc?: string;
  downloadCount: string;
  likes: string;
  size: string;
  author?: string;
  link: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  packageCardStyle: "default";
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

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.packageCard}
      ${getStyle(packageCardStyle)}`}
    >
      <div className={styles.packageCardImageWrapper}>
        <img
          src={imageSrc ? imageSrc : defaultImageSrc}
          className={styles.packageCardImage}
          alt={"package card of" + packageName}
        />
      </div>

      <div className={styles.packageCardContent}>
        <a href={link} className={styles.packageCardPackageName}>
          {packageName}
        </a>

        <div className={styles.packageCardAuthor}>
          <span className={styles.packageCardAuthor_prefix}>by </span>
          <a className={styles.packageCardAuthor_author} href={authorLink}>
            {author}
          </a>
        </div>

        <p className={styles.packageCardDescription}>{description}</p>

        <div className={styles.packageCardCategoryWrapper}>
          {getCategoryTagList(categories)}
        </div>
      </div>

      <div className={styles.packageCardFooter}>
        <p className={styles.packageCardLastUpdated}>
          {"Last updated: " + lastUpdated}
        </p>

        {getMetaItemList(downloadCount, likes, size)}
      </div>
    </div>
  );
};

PackageCard.defaultProps = {
  packageCardStyle: "default",
  categories: [],
  likes: "",
  downloadCount: "",
  size: "",
  packageName: "",
  link: "",
};

function getStyle(style: string) {
  switch (style) {
    case "default":
    default:
      return styles.packageCard__default;
  }
}

function getCategoryTagList(categories: string[]) {
  const categoryList: ReactNode[] = [];
  categories.forEach((category) =>
    categoryList.push(
      <Tag tagSize="small" label={category} tagStyle={"default"} />
    )
  );
  return categoryList;
}

function getMetaItemList(downloadCount: string, likes: string, size: string) {
  return (
    <div className={styles.packageCardMetaItemWrapper}>
      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faDownload} />}
        label={downloadCount}
        metaItemStyle={"tertiary"}
      />

      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faThumbsUp} />}
        label={likes}
        metaItemStyle={"tertiary"}
      />

      <div className={styles.packageCardMetaItem__last}>
        <MetaItem
          icon={<FontAwesomeIcon fixedWidth icon={faHardDrive} />}
          label={size}
          metaItemStyle={"tertiary"}
        />
      </div>
    </div>
  );
}
