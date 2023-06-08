import styles from "./CommunityImage.module.css";

export interface CommunityImageProps {
  src?: string;
}

/**
 * Cyberstorm CommunityImage component
 */
export function CommunityImage(props: CommunityImageProps) {
  const { src = "" } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"gameIcon"} src={src} />
    </div>
  );
}

CommunityImage.displayName = "CommunityImage";
