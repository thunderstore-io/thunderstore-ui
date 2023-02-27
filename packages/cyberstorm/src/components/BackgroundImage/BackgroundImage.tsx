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

  const backgroundImageStyle = { backgroundImage: "url(" + src + ")" };

  return <div className={styles.img} style={backgroundImageStyle}></div>;
};

BackgroundImage.displayName = "BackgroundImage";
BackgroundImage.defaultProps = {};
