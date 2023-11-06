"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MenuItem.module.css";
import { classnames } from "../../utils/utils";

export interface MenuItemProps {
  children?: ReactNode | ReactNode[];
  fontSize?: "medium" | "small";
}

/**
 * Cyberstorm MenuItem component
 */
export const MenuItem: React.FC<MenuItemProps> = React.forwardRef<
  HTMLDivElement,
  MenuItemProps
>((props, forwardedRef) => {
  const { children, fontSize = "medium", ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={classnames(styles.root, getFontSize(fontSize))}
    >
      {children}
    </div>
  );
});

const getFontSize = (scheme: string) => {
  return {
    small: styles.menuItemLabel__fontSize__small,
    medium: styles.menuItemLabel__fontSize__medium,
  }[scheme];
};

MenuItem.displayName = "MenuItem";

export { MenuItem as Root };
