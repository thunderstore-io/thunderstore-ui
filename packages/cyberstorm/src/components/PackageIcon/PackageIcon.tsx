import styles from "./PackageIcon.module.css";

export interface PackageIconProps {
  imageSrc?: string;
}

/**
 * Cyberstorm PackageIcon component
 */
export function PackageIcon(props: PackageIconProps) {
  const { imageSrc = "" } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"PackageIcon"} src={imageSrc} />
    </div>
  );
}

PackageIcon.displayName = "PackageIcon";
