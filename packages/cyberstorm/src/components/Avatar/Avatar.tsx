import { NewIcon } from "../..";
import { classnames } from "../../utils/utils";
import styles from "./Avatar.module.css";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface AvatarProps {
  src?: string | null;
  size?: "verySmoll" | "small" | "medium" | "large";
  username: string | null;
}

/**
 * Cyberstorm Avatar component
 */
export function Avatar(props: AvatarProps) {
  const { src, size = "medium", username } = props;

  if (username) {
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
  } else {
    return (
      <NewIcon
        csMode="inline"
        noWrapper
        rootClasses={classnames(styles.placeholderRoot, getSize(size))}
      >
        <FontAwesomeIcon icon={faUser} />
      </NewIcon>
    );
  }
}

Avatar.displayName = "Avatar";

const getSize = (scheme: AvatarProps["size"] = "medium") => {
  return {
    verySmoll: styles.verySmoll,
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
