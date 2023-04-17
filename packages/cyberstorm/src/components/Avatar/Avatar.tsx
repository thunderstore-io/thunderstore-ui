import React from "react";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  src: string;
  size?: "medium" | "large";
}

/**
 * Cyberstorm Avatar component
 */
export const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, size } = props;
  return (
    <div className={styles.root}>
      <img
        className={`${styles.image} ${getSize(size)}`}
        alt={"Avatar"}
        src={src}
      />
    </div>
  );
};

Avatar.displayName = "Avatar";
Avatar.defaultProps = { size: "medium" };

const getSize = (scheme: AvatarProps["size"] = "medium") => {
  return {
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
