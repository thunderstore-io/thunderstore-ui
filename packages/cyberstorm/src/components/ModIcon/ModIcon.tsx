import styles from "./ModIcon.module.css";

export interface ModIconProps {
  src?: string;
}

/**
 * Cyberstorm ModIcon component
 */
export function ModIcon(props: ModIconProps) {
  const { src = "" } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"ModIcon"} src={src} />
    </div>
  );
}

ModIcon.displayName = "ModIcon";
