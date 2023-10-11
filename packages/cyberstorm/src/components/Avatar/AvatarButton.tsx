"use client";
import styles from "./Avatar.module.css";
import React, { PropsWithChildren, useRef } from "react";

export interface AvatarButtonProps {
  src: string;
  size?: "medium" | "large";
  colorScheme?: "default";
}

/**
 * Cyberstorm AvatarButton component
 */
export const AvatarButton = React.forwardRef<
  HTMLButtonElement,
  AvatarButtonProps
>((props: PropsWithChildren<AvatarButtonProps>, forwardedRef) => {
  const { src, colorScheme, size = "medium", ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <button
      className={`${styles.root} ${getSize(size)}`}
      {...forwardedProps}
      ref={ref}
    >
      <img src={src} className={`${styles.image} ${getSize(size)}`} alt="" />
    </button>
  );
});

AvatarButton.displayName = "AvatarButton";

const getSize = (scheme: AvatarButtonProps["size"] = "medium") => {
  return {
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
