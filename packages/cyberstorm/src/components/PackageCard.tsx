import React from "react";
import styles from "./componentStyles/PackageCard.module.css";

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
  packageCardStyle?: string;
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
  } = props;
  styles; //if styles is not called, the classes from the css module aren't found
  const additionalStyle = packageCardStyle
    ? " packageCard__" + packageCardStyle
    : " packageCard__default";
  const authorLink = ""; //TODO: author link

  return (
    <a href={link} className={"packageCard" + additionalStyle}>
      <img
        src={imageSrc ? imageSrc : defaultImageSrc}
        className="packageCardImage"
        alt="package card"
      />
      <div className="packageCardContent">
        {packageName ? (
          <h4 className="packageCardPackageName">{packageName}</h4>
        ) : null}
        <div className="packageCardAuthor">
          <span className="packageCardAuthor_prefix">by </span>
          <a className="packageCardAuthor_author" href={authorLink}>
            {author}
          </a>
        </div>
        <p className="packageCardDescription">{description}</p>
        <p className="packageCardLastUpdated">{"Last updated: " + lastUpdated}</p>
      </div>
    </a>
  );
};
