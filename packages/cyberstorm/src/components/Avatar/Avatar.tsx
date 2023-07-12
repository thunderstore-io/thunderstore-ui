import styles from "./Avatar.module.css";

export interface AvatarProps {
  src: string;
  size?: "medium" | "large";
}

/**
 * Cyberstorm Avatar component
 */
export function Avatar(props: AvatarProps) {
  const { src, size = "medium" } = props;

  return (
    <div className={`${styles.root} ${getSize(size)}`}>
      <img
        className={`${styles.image} ${styles.show} ${getSize(size)}`}
        alt={"Avatar"}
        src={src}
      />
    </div>
  );
}

Avatar.displayName = "Avatar";

const getSize = (scheme: AvatarProps["size"] = "medium") => {
  return {
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
