import styles from "./GameIcon.module.css";

export interface GameIconProps {
  src?: string;
}

/**
 * Cyberstorm GameIcon component
 */
export function GameIcon(props: GameIconProps) {
  const { src = "" } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"gameIcon"} src={src} />
    </div>
  );
}

GameIcon.displayName = "GameIcon";
