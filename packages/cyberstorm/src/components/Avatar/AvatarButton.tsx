"use client";
import { classnames } from "../../utils/utils";
import styles from "./Avatar.module.css";
import React, { PropsWithChildren, useRef } from "react";

export interface AvatarButtonProps {
  src?: string | null;
  size?: "small" | "medium" | "large";
  colorScheme?: "default";
  username: string;
}

/**
 * Cyberstorm AvatarButton component
 */
export const AvatarButton = React.forwardRef<
  HTMLButtonElement,
  AvatarButtonProps
>((props: PropsWithChildren<AvatarButtonProps>, forwardedRef) => {
  const {
    src,
    colorScheme,
    size = "medium",
    username,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <button
      className={classnames(styles.root, getSize(size))}
      {...forwardedProps}
      ref={ref}
    >
      {src ? (
        <img
          src={src}
          className={classnames(styles.image, getSize(size))}
          alt=""
        />
      ) : (
        <div className={classnames(styles.image, styles.placeholder)}>
          {username.charAt(0).toUpperCase()}
        </div>
      )}
    </button>
  );
});

AvatarButton.displayName = "AvatarButton";

const getSize = (scheme: AvatarButtonProps["size"] = "medium") => {
  return {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
