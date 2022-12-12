import React from "react";
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
  colorScheme?: "default";
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
    colorScheme,
    categories,
  } = props;
  //TODO: add isPinned, isNsfw and isDeprecated to the props to use with the PackageFlag
  //TODO: add faThumbtack to the imported fa icons
  //TODO: import ReactNode

  const authorLink = ""; //TODO: author link
  //TODO: convert <a> tags into link components!
  //TODO: Use LastUpdated component once one is developed

  return (
    <div className={`${styles.root} ${getStyle(colorScheme)}`}>
      <a href={link} className={styles.imageWrapper} title={packageName}>
        <img
          src={imageSrc ? imageSrc : defaultImageSrc}
          className={styles.image}
          alt={packageName}
        />
        <div className={styles.flagWrapper}>
          {/*getPackageFlags(isPinned, isNsfw, isDeprecated)*/}
        </div>
      </a>

      <div className={styles.content}>
        <a href={link} className={styles.title}>
          {packageName}
        </a>

        {author ? (
          <div className={styles.author}>
            <span className={styles.author_prefix}>by</span>
            <a className={styles.author_label} href={authorLink}>
              {author}
            </a>
          </div>
        ) : null}

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <div className={styles.categoryWrapper}>
          {categories.map((c) => (
            <Tag key={c} label={c} size="small" colorScheme={"default"} />
          ))}
        </div>
      ) : null}

      <div className={styles.footer}>
        {lastUpdated ? (
          <p className={styles.lastUpdated}>{"Last updated: " + lastUpdated}</p>
        ) : null}

        {getMetaItemList(downloadCount, likes, size)}
      </div>
    </div>
  );
};

PackageCard.defaultProps = {
  colorScheme: "default",
  categories: [],
  likes: "",
  downloadCount: "",
  size: "",
  packageName: "",
  link: "",
};

const getStyle = (scheme: PackageCardProps["colorScheme"] = "default") => {
  return {
    default: styles.packageCard__default,
  }[scheme];
};

/*
function getPackageFlags(
  isPinned: boolean | undefined,
  isNsfw: boolean | undefined,
  isDeprecated: boolean | undefined
) {
  const flagList: ReactNode[] = [];
  if (isPinned) {
    flagList.push(
      <PackageFlag
        label="Pinned"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isNsfw) {
    flagList.push(
      <PackageFlag
        label="NSFW"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  if (isDeprecated) {
    flagList.push(
      <PackageFlag
        label="Deprecated"
        icon={<FontAwesomeIcon fixedWidth icon={faThumbtack} />}
      />
    );
  }
  return flagList;
}
*/

function getMetaItemList(downloadCount: string, likes: string, size: string) {
  return (
    <div className={styles.metaItemWrapper}>
      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faDownload} />}
        label={downloadCount}
        colorScheme={"tertiary"}
      />

      <MetaItem
        icon={<FontAwesomeIcon fixedWidth icon={faThumbsUp} />}
        label={likes}
        colorScheme={"tertiary"}
      />

      <div className={styles.metaItem__last}>
        <MetaItem
          icon={<FontAwesomeIcon fixedWidth icon={faHardDrive} />}
          label={size}
          colorScheme={"tertiary"}
        />
      </div>
    </div>
  );
}
