"use client";
import React, { useRef } from "react";
import styles from "./Tag.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface TagProps {
  key?: string;
  label?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  colorScheme?:
    | "default"
    | "borderless"
    | "static"
    | "removable"
    | "simple"
    | "success"
    | "info"
    | "borderless_removable"
    | "borderless_no_hover"
    | "high_contrast"
    | "blue"
    | "pink"
    | "green"
    | "yellow";
  size?: "tiny" | "small" | "medium" | "mediumPlus";
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
      className={classnames(getSize(size), styles.root, getStyle(colorScheme))}
    >
      {leftIcon ? (
        <Icon inline wrapperClasses={styles.icon}>
          {leftIcon}
        </Icon>
      ) : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? (
        <Icon inline wrapperClasses={styles.icon}>
          {rightIcon}
        </Icon>
      ) : null}
    </div>
  );
});

Tag.displayName = "Tag";

const getStyle = (scheme: TagProps["colorScheme"] = "default") => {
  return {
    default: styles.tag__default,
    borderless: styles.tag__borderless,
    static: styles.tag__static,
    removable: styles.tag__removable,
    simple: styles.tag__simple,
    success: styles.tag__success,
    info: styles.tag__info,
    borderless_removable: styles.tag__borderless_removable,
    borderless_no_hover: styles.tag__borderless_no_hover,
    high_contrast: styles.tag__high_contrast,
    blue: styles.tag__blue,
    pink: styles.tag__pink,
    green: styles.tag__green,
    yellow: styles.tag__yellow,
  }[scheme];
};

const getSize = (scheme: TagProps["size"] = "medium") => {
  return {
    tiny: styles.tiny,
    small: styles.small,
    medium: styles.medium,
    mediumPlus: styles.mediumPlus,
  }[scheme];
};
