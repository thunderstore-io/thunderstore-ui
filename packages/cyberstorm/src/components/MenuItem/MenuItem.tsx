"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MenuItem.module.css";

export interface MenuItemProps {
  children?: ReactNode | ReactNode[];
}

/**
 * Cyberstorm MenuItem component
 */
export const MenuItem: React.FC<MenuItemProps> = React.forwardRef<
  HTMLDivElement,
  MenuItemProps
>((props, forwardedRef) => {
  const { children, ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div {...forwardedProps} ref={ref} className={styles.root}>
      {children}
    </div>
  );
});

MenuItem.displayName = "MenuItem";

const Root = MenuItem;
export { Root };
