import styles from "../BackgroundImage/BackgroundImage.module.css";

export interface BackgroundImageProps {
  imageSource: string;
}

/**
 * Cyberstorm BackgroundImage
 */
export function BackgroundImage(props: BackgroundImageProps) {
  const { imageSource } = props;

  const backgroundImageStyle = { backgroundImage: "url(" + imageSource + ")" };

  return <div className={styles.img} style={backgroundImageStyle}></div>;
}

BackgroundImage.displayName = "BackgroundImage";
