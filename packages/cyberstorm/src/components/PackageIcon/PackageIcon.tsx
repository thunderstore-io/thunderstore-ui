import React from "react";
import styles from "./PackageIcon.module.css";

export interface PackageIconProps {
  imageSrc?: string;
}

/**
 * Cyberstorm PackageIcon component
 */
export const PackageIcon: React.FC<PackageIconProps> = (props) => {
  const { imageSrc } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"PackageIcon"} src={imageSrc} />
    </div>
  );
};

PackageIcon.displayName = "PackageIcon";
PackageIcon.defaultProps = { imageSrc: "/images/thomas.jpg" };
