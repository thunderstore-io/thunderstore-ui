import styles from "../BackgroundImage/BackgroundImage.module.css";
import React from "react";

export interface BackgroundImageProps {
  src: string;
}

/**
 * Cyberstorm BackgroundImage
 */
export const BackgroundImage: React.FC<BackgroundImageProps> = (props) => {
  const { src } = props;

  return (
    <div className={styles.root}>
      <img alt="Background" src={src} />
    </div>
  );
};

BackgroundImage.displayName = "BackgroundImage";
BackgroundImage.defaultProps = {};
