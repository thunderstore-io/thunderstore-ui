import styles from "./Avatar.module.css";
import React, { PropsWithChildren, useRef } from "react";

export interface AvatarProps {
  src: string;
  size?: "medium" | "large";
  colorScheme?: "default";
}

/**
 * Cyberstorm Avatar component
 */
export const Avatar = React.forwardRef<HTMLButtonElement, AvatarProps>(
  (props: PropsWithChildren<AvatarProps>, forwardedRef) => {
    const { src, size, ...forwardedProps } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <button className={styles.root} {...forwardedProps} ref={ref}>
        <img
          className={`${styles.image} ${getSize(size)}`}
          alt={"Avatar"}
          src={src}
        />
      </button>
    );
  }
);

Avatar.displayName = "Avatar";
Avatar.defaultProps = { size: "medium" };

const getSize = (scheme: AvatarProps["size"] = "medium") => {
  return {
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
