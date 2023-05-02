import styles from "../BackgroundImage/BackgroundImage.module.css";

export interface BackgroundImageProps {
  src: string;
}

/**
 * Cyberstorm BackgroundImage
 */
export function BackgroundImage(props: BackgroundImageProps) {
  const { src } = props;

  const backgroundImageStyle = { backgroundImage: "url(" + src + ")" };

  return <div className={styles.img} style={backgroundImageStyle}></div>;
}

BackgroundImage.displayName = "BackgroundImage";
BackgroundImage.defaultProps = {};
