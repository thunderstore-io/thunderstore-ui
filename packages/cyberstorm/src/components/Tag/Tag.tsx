"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./Tag.module.css";

export interface TagProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?:
    | "default"
    | "static"
    | "removable"
    | "simple"
    | "success"
    | "info";
  size?: "tiny" | "small" | "medium";
}

/**
 * Cyberstorm Tag component
 */
export const Tag: React.FC<TagProps> = React.forwardRef<
  HTMLDivElement,
  TagProps
>((props, forwardedRef) => {
  const {
    label,
    colorScheme = "default",
    leftIcon,
    rightIcon,
    size = "medium",
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={`${getSize(size)} ${styles.root} ${getStyle(colorScheme)}`}
    >
      {leftIcon ? <div className={styles.icon}>{leftIcon}</div> : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? <div className={styles.icon}>{rightIcon}</div> : null}
    </div>
  );
});

Tag.displayName = "Tag";

const getStyle = (scheme: TagProps["colorScheme"] = "default") => {
  return {
    default: styles.tag__default,
    static: styles.tag__static,
    removable: styles.tag__removable,
    simple: styles.tag__simple,
    success: styles.tag__success,
    info: styles.tag__info,
  }[scheme];
};

const getSize = (scheme: TagProps["size"] = "medium") => {
  return {
    tiny: styles.tiny,
    small: styles.small,
    medium: styles.medium,
  }[scheme];
};
