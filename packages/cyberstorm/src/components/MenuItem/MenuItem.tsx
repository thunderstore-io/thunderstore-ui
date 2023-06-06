"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MenuItem.module.css";

export interface MenuItemProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default" | "primary";
}

/**
 * Cyberstorm MenuItem component
 */
export const MenuItem: React.FC<MenuItemProps> = React.forwardRef<
  HTMLDivElement,
  MenuItemProps
>((props, forwardedRef) => {
  const {
    label,
    leftIcon,
    rightIcon,
    colorScheme = "default",
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={`${styles.root} ${getStyle(colorScheme)}`}
    >
      {leftIcon ? (
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {leftIcon}
        </div>
      ) : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? (
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {rightIcon}
        </div>
      ) : null}
    </div>
  );
});

MenuItem.displayName = "MenuItem";

const getStyle = (scheme: MenuItemProps["colorScheme"] = "default") => {
  return {
    default: styles.menuItem__default,
    primary: styles.menuItem__primary,
  }[scheme];
};
