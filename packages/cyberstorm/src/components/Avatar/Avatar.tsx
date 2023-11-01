import { classnames } from "../../utils/utils";
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
    <div className={classnames(styles.root, getSize(size))}>
      <img
        src={src}
        className={classnames(styles.image, getSize(size))}
        alt=""
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
