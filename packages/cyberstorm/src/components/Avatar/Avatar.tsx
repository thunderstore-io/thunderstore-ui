import { classnames } from "../../utils/utils";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  src?: string | null;
  size?: "small" | "medium" | "large";
  username: string | null;
}

/**
 * Cyberstorm Avatar component
 */
export function Avatar(props: AvatarProps) {
  const { src, size = "medium", username } = props;

  return (
    <div className={classnames(styles.root, getSize(size))}>
      {src ? (
        <img
          src={src}
          className={classnames(styles.image, getSize(size))}
          alt=""
        />
      ) : (
        <div className={classnames(styles.image, styles.placeholder)}>
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </div>
  );
}

Avatar.displayName = "Avatar";

const getSize = (scheme: AvatarProps["size"] = "medium") => {
  return {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
